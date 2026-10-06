import { Link } from "react-router";

import { formatEuro, formatSignedPercent } from "../lib/format";
import type { PriceState, TickerPrice } from "../lib/store-types";

export interface PriceTickerProps {
  /** Null until the first response arrives. */
  prices: TickerPrice[] | null;
  state?: PriceState;
}

/** A one-line strip of live metal prices above the header. Every move carries a sign as well as a position, never colour alone. */
export function PriceTicker({ prices, state = "live" }: PriceTickerProps) {
  return (
    <div role="region" aria-label="Live metal prices" className="bg-foreground text-background flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-2 text-xs font-medium tabular-nums">
      {state === "stale" ? (
        <span>Prices delayed. Please call us for a live price.</span>
      ) : prices === null ? (
        <span>Loading live prices</span>
      ) : (
        prices.map((p) => (
          <Link key={p.metal} to={`/prices/${p.metal}/`} className="hover:underline">
            {p.label} {formatEuro(p.price)} {formatSignedPercent(p.changePercent)}
          </Link>
        ))
      )}
    </div>
  );
}
