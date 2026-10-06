import { useState } from "react";
import { Button } from "@goldilocks/ui/button";

import { MarketClosedDialog } from "../components/market-closed-dialog";
import { PaymentOptionsDialog } from "../components/payment-options-dialog";
import { PriceTicker } from "../components/price-ticker";
import { ProductCard } from "../components/product-card";
import { ProductRow } from "../components/product-row";
import { PublicFooter } from "../components/public-footer";
import { PublicHeader } from "../components/public-header";
import { emptyFilters, StoreFilters, StoreFiltersSheet, type StoreFilterState } from "../components/store-filters";
import type { StoreProduct, TickerPrice } from "../lib/store-types";

export function meta() {
  return [{ title: "Components" }];
}

const PRICES: TickerPrice[] = [
  { metal: "gold", label: "Gold", price: 3707, changePercent: 0.5 },
  { metal: "silver", label: "Silver", price: 54.53, changePercent: 0.2 },
  { metal: "platinum", label: "Platinum", price: 1512, changePercent: -1 },
  { metal: "palladium", label: "Palladium", price: 1034, changePercent: -1.2 },
];

const PRODUCTS: StoreProduct[] = [
  { id: "1", slug: "britannia-1oz", name: "Britannia 1 oz Gold Coin", metal: "gold", type: "coin", weightGrams: 31.1035, purity: "999.9", mint: "The Royal Mint", sellPrice: 3849, pricePerGram: 123.7557, availability: "in-stock", availabilityNote: "Dublin" },
  { id: "2", slug: "maple-leaf-1oz", name: "Maple Leaf 1 oz Gold Coin", metal: "gold", type: "coin", weightGrams: 31.1035, purity: "999.9", mint: "Royal Canadian Mint", sellPrice: 3861, pricePerGram: 124.1415, availability: "supplier-order", availabilityNote: "7 to 10 days" },
  { id: "3", slug: "pamp-10g", name: "PAMP Suisse 10 g Gold Bar", metal: "gold", type: "bar", weightGrams: 10, purity: "999.9", mint: "PAMP Suisse", sellPrice: 1296, pricePerGram: 129.6, availability: "in-stock", availabilityNote: "Cork" },
  { id: "4", slug: "valcambi-100g", name: "Valcambi 100 g Gold Bar", metal: "gold", type: "bar", weightGrams: 100, purity: "999.9", mint: "Valcambi", sellPrice: null, pricePerGram: null, availability: "unavailable" },
];

const BRANCHES = [
  { value: "dublin-burlington-road", label: "Dublin, Burlington Road" },
  { value: "dublin-blanchardstown", label: "Dublin, Blanchardstown" },
  { value: "cork", label: "Cork" },
];
const BOUNDS: [number, number] = [100, 15000];

// A living preview of the site components, only registered while developing (see routes.ts).
export default function Components() {
  const [filters, setFilters] = useState<StoreFilterState>(() => emptyFilters(BOUNDS));
  const [closedOpen, setClosedOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return (
    <div>
      <PriceTicker prices={PRICES} />
      <PublicHeader cartCount={3} />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-12">
        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl">Price ticker states</h2>
          <PriceTicker prices={null} />
          <PriceTicker prices={PRICES} state="stale" />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl">Product card and filters</h2>
          <div className="grid gap-6 md:grid-cols-[260px_1fr]">
            <div className="flex flex-col gap-3">
              <StoreFilters value={filters} onChange={setFilters} priceBounds={BOUNDS} branches={BRANCHES} />
              <div className="md:hidden">
                <StoreFiltersSheet value={filters} onChange={setFilters} priceBounds={BOUNDS} branches={BRANCHES} />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl">Product rows</h2>
          <div className="bg-card overflow-hidden rounded-xl border">
            {PRODUCTS.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-2xl">Order dialogs</h2>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setClosedOpen(true)}>
              Market closed
            </Button>
            <Button type="button" variant="outline" onClick={() => setPaymentOpen(true)}>
              Payment options
            </Button>
          </div>
          <MarketClosedDialog open={closedOpen} onOpenChange={setClosedOpen} nextOpening={new Date("2026-10-12T07:45:00Z")} onConfirm={() => setClosedOpen(false)} />
          <PaymentOptionsDialog open={paymentOpen} onOpenChange={setPaymentOpen} onConfirm={() => setPaymentOpen(false)} />
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
