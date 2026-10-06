import { Badge } from "@goldilocks/ui/badge";

import type { Availability } from "../lib/store-types";

const LABELS: Record<Availability, string> = {
  "in-stock": "In stock",
  "supplier-order": "Supplier order",
  unavailable: "Unavailable",
};

export function availabilityLabel(availability: Availability, note?: string): string {
  return note ? `${LABELS[availability]} · ${note}` : LABELS[availability];
}

export function ProductAvailability({ availability, note }: { availability: Availability; note?: string }) {
  return (
    <Badge variant={availability === "in-stock" ? "secondary" : "outline"} className="w-fit">
      {availabilityLabel(availability, note)}
    </Badge>
  );
}
