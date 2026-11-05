/**
 * Tells the Import hub what a dropped file is, from tab names and header rows only (no row data).
 * `detectTabType` is a port of `detectType_` in the owner's Apps Script, so both sides agree.
 */
export type TabType =
  | 'bc_journal' | 'bc_tracking' | 'zoho_products_sold' | 'bc_items' | 'zoho_invoices' | 'zoho_payments' | 'zoho_po'
  | 'zoho_contacts' | 'zoho_vendors' | 'bc_orders' | 'customer_safe' | 'trade_purchases' | 'trade_sales' | 'stock_bars' | 'stock_coins';

export type FileKind =
  | 'import_workbook'
  | 'redaction_map'
  | 'bc_awaiting_collection'
  | 'tradesheet'
  | 'zoho_export'
  | 'bc_stock'
  | 'stock_sheet'
  | 'mixed'
  | 'unknown';

const KIND_OF_TAB: Record<TabType, FileKind> = {
  bc_journal: 'bc_stock',
  bc_tracking: 'bc_stock',
  bc_items: 'bc_stock',
  bc_orders: 'bc_awaiting_collection',
  zoho_products_sold: 'zoho_export',
  zoho_invoices: 'zoho_export',
  zoho_payments: 'zoho_export',
  zoho_po: 'zoho_export',
  zoho_contacts: 'zoho_export',
  zoho_vendors: 'zoho_export',
  customer_safe: 'stock_sheet',
  stock_bars: 'stock_sheet',
  stock_coins: 'stock_sheet',
  trade_purchases: 'tradesheet',
  trade_sales: 'tradesheet',
};

const norm = (headers: readonly unknown[]): Record<string, true> => {
  const h: Record<string, true> = {};
  for (const x of headers) h[String(x).toLowerCase().replace(/:$/, '').trim()] = true;
  return h;
};

/** Returns '' for tabs that are not recognised (Spain tabs are ignored on purpose). */
export function detectTabType(tab: string, headers: readonly unknown[]): TabType | '' {
  if (/^es\b|^es[\s_-]|spain|barcelona|madrid/i.test(tab)) return '';
  const h = norm(headers);
  if (h['item no.'] && h['qty. (calculated)']) return 'bc_journal';
  if (h['item no.'] && h['serial no.'] && h['remaining quantity']) return 'bc_tracking';
  if (h['item_name'] && h['quantity_sold']) return 'zoho_products_sold';
  if (/^items$/i.test(tab) && headers.length <= 4) return 'bc_items';
  if (h['invoice number'] && h['item desc'] && h['invoice status']) return 'zoho_invoices';
  if (h['payment mode'] && h['invoice number'] && !h['item desc']) return 'zoho_payments';
  if (h['purchase order number']) return 'zoho_po';
  if (h['customer number'] && h['display name']) return 'zoho_contacts';
  if (h['vendor number'] && h['display name']) return 'zoho_vendors';
  if (h['external document no.'] && h['amount prepaid']) return 'bc_orders';
  if ((h['serials'] && h['status'] && h['client'] && h['reference']) || (/cst safe|customer safe|customer orders/i.test(tab) && h['client'])) return 'customer_safe';
  if (/^ie/i.test(tab) && h['price paid'] && h['received'] && h['client']) return 'trade_purchases';
  if (/^ie/i.test(tab) && h['cpty'] && h['client'] && h['reference']) return 'trade_sales';
  if (h['serial'] && h['refinery'] && h['weight']) return 'stock_bars';
  if ((h['item'] && (h['quantity'] || h['oct final'] || h['sept']) && !h['serial'] && !h['client']) || (/coin stock/i.test(tab) && headers.length >= 3)) return 'stock_coins';
  return '';
}

export interface TabHeaders {
  name: string;
  headers: readonly unknown[];
}

export interface DetectedFile {
  kind: FileKind;
  tabs: { name: string; type: TabType | '' }[];
}

/** File-level answer for the Import hub. A file is "mixed" when its recognised tabs belong to different kinds. */
export function detectFileType(tabs: readonly TabHeaders[]): DetectedFile {
  const names = new Set(tabs.map((t) => t.name.trim().toLowerCase()));
  const byName = (n: string) => tabs.find((t) => t.name.trim().toLowerCase() === n);
  const detected = tabs.map((t) => ({ name: t.name, type: detectTabType(t.name, t.headers) }));

  if (names.has('meta') && names.has('trades') && names.has('links')) return { kind: 'import_workbook', tabs: detected };

  const map = byName('map');
  if (map) {
    const h = norm(map.headers);
    if (h['code'] && h['original'] && tabs.every((t) => ['map', 'runs'].includes(t.name.trim().toLowerCase()))) {
      return { kind: 'redaction_map', tabs: detected };
    }
  }

  const kinds = new Set(detected.filter((d) => d.type).map((d) => KIND_OF_TAB[d.type as TabType]));
  if (kinds.size === 0) return { kind: 'unknown', tabs: detected };
  if (kinds.size > 1) return { kind: 'mixed', tabs: detected };
  return { kind: [...kinds][0]!, tabs: detected };
}
