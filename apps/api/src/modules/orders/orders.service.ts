import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import EventEmitter from "node:events";

@Injectable()
export class OrdersService {
    private supabase: SupabaseClient;

    constructor(
        private config: ConfigService,
        private eventEmitter: EventEmitter,
    ) {
        this.supabase = createClient(
            this.config.getOrThrow<string>('SUPABASE_URL'),
            this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
        );
    }

    async placeOrder(customerId: string, orderData: any) {
        const { items, notes, channel = 'app' } = orderData;
        let { address_id } = orderData;

        // If caller sends free-text delivery_address (customer app checkout), create address row
        if (!address_id && orderData.delivery_address) {
            const { data: addr, error: addrError } = await this.supabase
                .from('addresses')
                .insert({
                    user_id: customerId,
                    label: 'Delivery',
                    address_line: orderData.delivery_address,
                    latitude: 0,
                    longitude: 0,
                    is_default: false,
                })
                .select('id')
                .single();
            if (addrError) throw addrError;
            address_id = addr.id;
        }

        if (!items || items.length === 0) {
            throw new BadRequestException('Order must have at least one item');
        }

        // Fetch product prices and validate stock
        const productIds = items.map((i: any) => i.product_id);
        const { data: products, error: productError } = await this.supabase
            .from('products')
            .select('id, price, stock_quantity, name_en')
            .in('id', productIds);

        if (productError) throw productError;

        // Build order items with validated prices
        const orderItems = items.map((item: any) => {
            const product = products?.find((p) => p.id === item.product_id);
            if (!product) throw new BadRequestException(`Product ${item.product_id} not found`);
            if (product.stock_quantity < item.quantity) {
                throw new BadRequestException(`Insufficient stock for ${product.name_en}`);
            }
            return {
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: product.price,
                line_total: product.price * item.quantity,
            };
        });

        const subtotal = orderItems.reduce((sum: number, i: any) => sum + i.line_total, 0);
        const deliveryFee = Number(this.config.get('DELIVERY_FEE', '15'));
        const total = subtotal + deliveryFee;

        // Create order
        const { data: order, error: orderError } = await this.supabase
            .from('orders')
            .insert({
                customer_id: customerId,
                address_id,
                status: 'pending',
                channel,
                subtotal,
                delivery_fee: deliveryFee,
                total,
                notes,
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // Create order items
        const itemsWithOrderId = orderItems.map((item: any) => ({
            ...item,
            order_id: order.id,
        }));

        const { error: itemsError } = await this.supabase
            .from('order_items')
            .insert(itemsWithOrderId);

        if (itemsError) throw itemsError;

        // Emit event
        this.eventEmitter.emit('order.placed', { orderId: order.id, customerId });

        return { success: true, data: { ...order, items: orderItems } };
    }

    async getOrdersByCustomer(customerId: string, page: number) {
        const perPage = 20;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        const { data, count, error } = await this.supabase
            .from('orders')
            .select('*, order_items(*, products(name_en, name_ar, image_url))', { count: 'exact' })
            .eq('customer_id', customerId)
            .order('placed_at', { ascending: false })
            .range(from, to);

        if (error) throw error;
        return { success: true, data, total: count, page, per_page: perPage };
    }

    async getOrderById(id: string) {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*, order_items(*, products(name_en, name_ar, image_url, unit)), deliveries(*), addresses(*)')
            .eq('id', id)
            .single();

        if (error || !data) throw new NotFoundException('Order not found');
        return { success: true, data };
    }

    async updateOrderStatus(id: string, status: string) {
        const updates: any = { status };
        if (status === 'confirmed') updates.confirmed_at = new Date().toISOString();
        if (status === 'delivered') updates.delivered_at = new Date().toISOString();
        if (status === 'cancelled') updates.cancelled_at = new Date().toISOString();

        const { data, error } = await this.supabase
            .from('orders')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        this.eventEmitter.emit(`order.${status}`, { orderId: id });
        return { success: true, data };
    }

    async getAllOrders(filters: { status?: string; date?: string; page: number }) {
        const perPage = 20;
        const from = (filters.page - 1) * perPage;
        const to = from + perPage - 1;

        let query = this.supabase
            .from('orders')
            .select('*, profiles!customer_id(full_name, phone), order_items(count)', { count: 'exact' });

        if (filters.status) query = query.eq('status', filters.status);
        if (filters.date) {
            query = query.gte('placed_at', `${filters.date}T00:00:00`)
                .lte('placed_at', `${filters.date}T23:59:59`);
        }

        const { data, count, error } = await query
            .order('placed_at', { ascending: false })
            .range(from, to);

        if (error) throw error;
        return { success: true, data, total: count, page: filters.page, per_page: perPage };
    }

    async getAdminStats() {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        const [ordersResult, captainsResult, stockResult] = await Promise.all([
            this.supabase
                .from('orders')
                .select('total', { count: 'exact' })
                .gte('placed_at', `${today}T00:00:00`)
                .lte('placed_at', `${today}T23:59:59`),
            this.supabase
                .from('captain_profiles')
                .select('id', { count: 'exact' })
                .in('availability', ['online', 'busy']),
            this.supabase
                .from('products')
                .select('stock_quantity, low_stock_threshold')
                .eq('is_available', true),
        ]);

        if (ordersResult.error) throw ordersResult.error;
        if (captainsResult.error) throw captainsResult.error;
        if (stockResult.error) throw stockResult.error;

        const todayRevenue = (ordersResult.data ?? []).reduce(
            (sum, o) => sum + (Number(o.total) || 0), 0
        );
        const lowStockItems = (stockResult.data ?? []).filter(
            p => p.stock_quantity <= p.low_stock_threshold,
        ).length;

        return {
            success: true,
            data: {
                todays_orders:   ordersResult.count ?? 0,
                todays_revenue:  Math.round(todayRevenue * 100) / 100,
                active_captains: captainsResult.count ?? 0,
                low_stock_items: lowStockItems,
            },
        };
    }
}
