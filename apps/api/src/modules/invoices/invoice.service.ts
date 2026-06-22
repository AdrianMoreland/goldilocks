import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface CreateInvoiceDto {
    order_id: string;
    customer_id: string;
    items: Array<{
        product_id?: string;
        description_en: string;
        description_ar?: string;
        quantity: number;
        unit_price: number;
    }>;
    delivery_fee?: number;
    discount?: number;
    // B2B fields
    business_name?: string;
    business_name_ar?: string;
    tax_number?: string;
    cr_number?: string;
    // Delivery method
    send_via?: 'email' | 'sms' | 'whatsapp' | 'in_app';
    recipient_email?: string;
    recipient_phone?: string;
    notes?: string;
}

@Injectable()
export class InvoiceService {
    private readonly logger = new Logger(InvoiceService.name);
    private supabase: SupabaseClient;
    private readonly VAT_RATE: number;
    private readonly SELLER_NAME: string;
    private readonly SELLER_TAX_NUMBER: string;

    constructor(private config: ConfigService) {
        this.supabase = createClient(
            this.config.getOrThrow<string>('SUPABASE_URL'),
            this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
        );
        this.VAT_RATE = Number(this.config.get('INVOICE_VAT_RATE', '15'));
        if (!Number.isFinite(this.VAT_RATE) || this.VAT_RATE < 0) {
            throw new Error(`Invalid INVOICE_VAT_RATE: "${this.config.get('INVOICE_VAT_RATE')}"`);
        }
        this.SELLER_NAME = this.config.get<string>('INVOICE_SELLER_NAME', 'SinaMart Delivery');
        this.SELLER_TAX_NUMBER = this.config.get<string>('INVOICE_TAX_NUMBER', '300000000000003');
    }

    /**
     * Generate a digital invoice for an order.
     * Auto-calculates VAT, generates invoice number, and creates QR data.
     */
    async generateInvoice(dto: CreateInvoiceDto) {
        // Calculate totals
        const subtotal = dto.items.reduce((sum, i) => sum + (i.unit_price * i.quantity), 0);
        const deliveryFee = dto.delivery_fee || 0;
        const discount = dto.discount || 0;
        const taxableAmount = subtotal + deliveryFee - discount;
        const vatAmount = Number((taxableAmount * this.VAT_RATE / 100).toFixed(2));
        const total = Number((taxableAmount + vatAmount).toFixed(2));

        // Generate ZATCA-compatible QR data (TLV encoding)
        const qrData = this.generateZatcaQr({
            sellerName: this.SELLER_NAME,
            taxNumber: this.SELLER_TAX_NUMBER,
            timestamp: new Date().toISOString(),
            totalWithVat: total.toFixed(2),
            vatAmount: vatAmount.toFixed(2),
        });

        // Create invoice
        const { data: invoice, error } = await this.supabase
            .from('invoices')
            .insert({
                order_id: dto.order_id,
                customer_id: dto.customer_id,
                business_name: dto.business_name || null,
                business_name_ar: dto.business_name_ar || null,
                tax_number: dto.tax_number || null,
                cr_number: dto.cr_number || null,
                subtotal,
                delivery_fee: deliveryFee,
                discount,
                vat_rate: this.VAT_RATE,
                vat_amount: vatAmount,
                total,
                status: 'issued',
                sent_via: dto.send_via || 'in_app',
                recipient_email: dto.recipient_email || null,
                recipient_phone: dto.recipient_phone || null,
                qr_data: qrData,
                notes: dto.notes || null,
            })
            .select()
            .single();

        if (error) {
            this.logger.error('Failed to create invoice', error);
            throw error;
        }

        // Create invoice line items
        const invoiceItems = dto.items.map(item => ({
            invoice_id: invoice.id,
            product_id: item.product_id || null,
            description_en: item.description_en,
            description_ar: item.description_ar || item.description_en,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: Number((item.unit_price * item.quantity).toFixed(2)),
            vat_amount: Number((item.unit_price * item.quantity * this.VAT_RATE / 100).toFixed(2)),
        }));

        const { error: itemsError } = await this.supabase
            .from('invoice_items')
            .insert(invoiceItems);

        if (itemsError) {
            this.logger.error('Failed to create invoice items', itemsError);
            throw new Error(`Failed to create invoice items: ${itemsError.message}`);
        }

        // Send notification based on delivery method
        await this.sendInvoiceNotification(invoice, dto.send_via || 'in_app');

        this.logger.log(`Invoice ${invoice.invoice_number} generated for order ${dto.order_id}`);

        return { data: { ...invoice, items: invoiceItems } };
    }

    /**
     * Auto-generate invoice when order is placed (for B2B customers)
     */
    async autoGenerateForOrder(orderId: string) {
        // Fetch order with items and customer
        const { data: order } = await this.supabase
            .from('orders')
            .select('*, order_items(*, products(name_en, name_ar, price)), profiles(*)')
            .eq('id', orderId)
            .single();

        if (!order) throw new Error('Order not found');

        const customer = order.profiles;
        const items = (order.order_items || []).map((oi: any) => ({
            product_id: oi.product_id,
            description_en: oi.products?.name_en || 'Product',
            description_ar: oi.products?.name_ar || 'منتج',
            quantity: oi.quantity,
            unit_price: oi.unit_price || oi.products?.price || 0,
        }));

        return this.generateInvoice({
            order_id: orderId,
            customer_id: customer.id,
            items,
            delivery_fee: order.delivery_fee || 0,
            business_name: customer.business_name,
            business_name_ar: customer.business_name_ar,
            tax_number: customer.tax_number,
            cr_number: customer.cr_number,
            send_via: customer.is_business ? 'email' : 'in_app',
            recipient_email: customer.email,
            recipient_phone: customer.phone,
        });
    }

    /**
     * Get invoices for a customer or all (admin)
     */
    async getInvoices(filters: { customer_id?: string; status?: string; limit?: number }) {
        let query = this.supabase
            .from('invoices')
            .select('*, orders(id, status)')
            .order('created_at', { ascending: false });

        if (filters.customer_id) query = query.eq('customer_id', filters.customer_id);
        if (filters.status) query = query.eq('status', filters.status);
        if (filters.limit) query = query.limit(filters.limit);

        const { data, error } = await query;
        if (error) throw error;
        return { data };
    }

    /**
     * Get single invoice with line items
     */
    async getInvoiceById(invoiceId: string) {
        const { data: invoice, error } = await this.supabase
            .from('invoices')
            .select('*')
            .eq('id', invoiceId)
            .single();

        if (error) throw error;

        const { data: items } = await this.supabase
            .from('invoice_items')
            .select('*')
            .eq('invoice_id', invoiceId);

        return { data: { ...invoice, items: items || [] } };
    }

    /**
     * Generate ZATCA-compatible QR code data (simplified TLV)
     * Fields: 1=Seller, 2=VAT#, 3=Timestamp, 4=Total, 5=VAT Amount
     */
    private generateZatcaQr(data: {
        sellerName: string;
        taxNumber: string;
        timestamp: string;
        totalWithVat: string;
        vatAmount: string;
    }): string {
        const fields = [
            { tag: 1, value: data.sellerName },
            { tag: 2, value: data.taxNumber },
            { tag: 3, value: data.timestamp },
            { tag: 4, value: data.totalWithVat },
            { tag: 5, value: data.vatAmount },
        ];

        // TLV encoding → Base64
        const tlvBytes: number[] = [];
        for (const f of fields) {
            const valueBytes = Buffer.from(f.value, 'utf-8');
            tlvBytes.push(f.tag, valueBytes.length, ...valueBytes);
        }
        return Buffer.from(tlvBytes).toString('base64');
    }

    /**
     * Send invoice notification
     */
    private async sendInvoiceNotification(invoice: any, method: string) {
        this.logger.log(`Sending invoice ${invoice.invoice_number} via ${method}`);
        // Mark as sent
        await this.supabase
            .from('invoices')
            .update({ sent_at: new Date().toISOString() })
            .eq('id', invoice.id);

        // TODO: Integrate with actual email/SMS/WhatsApp services
        // For now, just mark as sent
    }
}