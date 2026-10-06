import { useState } from "react";
import { Button } from "@goldilocks/ui/button";
import { Card } from "@goldilocks/ui/card";

import { formatEuro, formatEuroCents, formatWeight } from "../lib/format";
import type { StoreProduct } from "../lib/store-types";
import { ProductAvailability } from "./product-availability";
import { QuantityStepper } from "./quantity-stepper";

export interface ProductCardProps {
  product: StoreProduct;
  onAddToCart?: (product: StoreProduct, quantity: number) => void;
  /** Opens the details panel. Without it, Details is a plain link to the product page. */
  onDetails?: (product: StoreProduct) => void;
}

/** One product in the store grid: image, availability, name, price, quantity and Add to cart. */
export function ProductCard({ product, onAddToCart, onDetails }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const unavailable = product.availability === "unavailable";
  const { sellPrice, pricePerGram } = product;
  const priced = sellPrice !== null;

  return (
    <Card className="w-full gap-0 overflow-hidden py-0">
      <div className="bg-muted text-muted-foreground flex h-40 items-center justify-center text-sm">
        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-full w-full object-contain p-4" loading="lazy" /> : "Product image"}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <ProductAvailability availability={product.availability} note={product.availabilityNote} />
        <h3 className="font-heading text-lg leading-snug">{product.name}</h3>
        <p className="text-muted-foreground text-sm">
          {formatWeight(product.weightGrams)} · {product.purity} · {product.mint}
        </p>
        <div className="flex items-baseline gap-2">
          {sellPrice !== null ? (
            <>
              <span className="text-price-text text-2xl font-semibold tabular-nums">{formatEuro(sellPrice)}</span>
              {pricePerGram !== null && <span className="text-muted-foreground text-sm tabular-nums">{formatEuroCents(pricePerGram)} per g</span>}
            </>
          ) : (
            <span className="text-muted-foreground text-sm">Price unavailable right now</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <QuantityStepper value={quantity} onChange={setQuantity} disabled={unavailable || !priced} label={`Quantity of ${product.name}`} />
          <Button type="button" className="flex-1" disabled={unavailable || !priced} onClick={() => onAddToCart?.(product, quantity)}>
            Add to cart
          </Button>
        </div>
        <Button asChild variant="link" size="sm" className="w-fit px-0">
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
    </Card>
  );
}
