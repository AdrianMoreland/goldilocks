import { useState } from "react";
import { Button } from "@goldilocks/ui/button";

import { formatEuro, formatEuroCents, formatWeight } from "../lib/format";
import type { StoreProduct } from "../lib/store-types";
import { ProductAvailability } from "./product-availability";
import { QuantityStepper } from "./quantity-stepper";

export interface ProductRowProps {
  product: StoreProduct;
  onAddToCart?: (product: StoreProduct, quantity: number) => void;
  onDetails?: (product: StoreProduct) => void;
}

/** One product as a table-like row, for comparing many products (the compact view of the store). */
export function ProductRow({ product, onAddToCart, onDetails }: ProductRowProps) {
  const [quantity, setQuantity] = useState(1);
  const unavailable = product.availability === "unavailable";
  const { sellPrice, pricePerGram } = product;
  const priced = sellPrice !== null;

  return (
    <div className="flex flex-wrap items-center gap-4 border-b px-4 py-3 last:border-b-0">
      <div className="bg-muted text-muted-foreground flex size-14 shrink-0 items-center justify-center rounded-md text-xs">
        {product.imageUrl ? <img src={product.imageUrl} alt="" className="size-full object-contain p-1" loading="lazy" /> : "img"}
      </div>
      <div className="min-w-48 flex-1 basis-64">
        <p className="font-medium">{product.name}</p>
        <p className="text-muted-foreground text-sm">
          {formatWeight(product.weightGrams)} · {product.purity} · {product.mint}
        </p>
      </div>
      <div className="w-48">
        <ProductAvailability availability={product.availability} note={product.availabilityNote} />
      </div>
      <div className="w-28 tabular-nums">
        {sellPrice !== null ? (
          <>
            <p className="text-price-text font-semibold">{formatEuro(sellPrice)}</p>
            {pricePerGram !== null && <p className="text-muted-foreground text-sm">{formatEuroCents(pricePerGram)} per g</p>}
          </>
        ) : (
          <p className="text-muted-foreground text-sm">Unavailable</p>
        )}
      </div>
      <QuantityStepper value={quantity} onChange={setQuantity} disabled={unavailable || !priced} label={`Quantity of ${product.name}`} />
      <Button type="button" size="sm" disabled={unavailable || !priced} onClick={() => onAddToCart?.(product, quantity)}>
        Add to cart
      </Button>
      <Button asChild variant="link" size="sm">
        <a
          href={`/products/${product.slug}/`}
          onClick={(event) => {
            if (!onDetails) return;
            event.preventDefault();
            onDetails(product);
          }}
        >
          Details
        </a>
      </Button>
    </div>
  );
}
