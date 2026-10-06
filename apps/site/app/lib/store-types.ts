// The shapes the store components take as props. They become schemas in packages/shared-types when the public
// catalogue endpoint is built (docs/SITE-PLAN.md, Phase C); until then they only describe what the UI needs.

export const METALS = ["gold", "silver", "platinum", "palladium", "copper"] as const;
export type Metal = (typeof METALS)[number];

export const PRODUCT_TYPES = ["coin", "bar"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export type Availability = "in-stock" | "supplier-order" | "unavailable";

export interface StoreProduct {
  id: string;
  slug: string;
  name: string;
  metal: Metal;
  type: ProductType;
  weightGrams: number;
  /** Fineness as printed on the product, for example "999.9". */
  purity: string;
  mint: string;
  /** Sell price in whole euro, or null while the price is unavailable (stale spot). */
  sellPrice: number | null;
  /** Euro per gram, cent precision, or null with the price. */
  pricePerGram: number | null;
  availability: Availability;
  /** Where or when, for example "Dublin" or "7 to 10 days". */
  availabilityNote?: string;
  imageUrl?: string;
}

export type PriceState = "live" | "stale";

export interface TickerPrice {
  metal: Exclude<Metal, "copper">;
  label: string;
  /** Euro per troy ounce. */
  price: number;
  /** Day change in percent, signed. */
  changePercent: number;
}
