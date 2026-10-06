import { Button } from "@goldilocks/ui/button";
import { Checkbox } from "@goldilocks/ui/checkbox";
import { Label } from "@goldilocks/ui/label";
import { RangeSlider } from "@goldilocks/ui/range-slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@goldilocks/ui/select";
import { Separator } from "@goldilocks/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@goldilocks/ui/sheet";

import { formatEuro } from "../lib/format";
import { METALS, PRODUCT_TYPES, type Metal, type ProductType } from "../lib/store-types";

export interface StoreFilterState {
  metals: Metal[];
  types: ProductType[];
  priceRange: [number, number];
  /** A branch id, or "any". */
  branch: string;
}

export const ANY_BRANCH = "any";

export function emptyFilters(priceBounds: [number, number]): StoreFilterState {
  return { metals: [], types: [], priceRange: priceBounds, branch: ANY_BRANCH };
}

export function activeFilterCount(value: StoreFilterState, priceBounds: [number, number]): number {
  return (
    value.metals.length +
    value.types.length +
    (value.priceRange[0] !== priceBounds[0] || value.priceRange[1] !== priceBounds[1] ? 1 : 0) +
    (value.branch !== ANY_BRANCH ? 1 : 0)
  );
}

const METAL_LABELS: Record<Metal, string> = { gold: "Gold", silver: "Silver", platinum: "Platinum", palladium: "Palladium", copper: "Copper" };
const TYPE_LABELS: Record<ProductType, string> = { coin: "Coins", bar: "Bars" };

const toggle = <T,>(list: T[], item: T, on: boolean) => (on ? [...list, item] : list.filter((x) => x !== item));

export interface StoreFiltersProps {
  value: StoreFilterState;
  onChange: (value: StoreFilterState) => void;
  priceBounds: [number, number];
  branches: { value: string; label: string }[];
}

/** The store's filter panel: metal, type, price range and the branch to collect from. */
export function StoreFilters({ value, onChange, priceBounds, branches }: StoreFiltersProps) {
  const count = activeFilterCount(value, priceBounds);
  return (
    <div className="bg-card flex w-full flex-col gap-4 rounded-xl border p-4">
      <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Filters</p>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">Metal</legend>
        {METALS.map((metal) => (
          <div key={metal} className="flex items-center gap-2">
            <Checkbox id={`metal-${metal}`} checked={value.metals.includes(metal)} onCheckedChange={(on) => onChange({ ...value, metals: toggle(value.metals, metal, on === true) })} />
            <Label htmlFor={`metal-${metal}`}>{METAL_LABELS[metal]}</Label>
          </div>
        ))}
      </fieldset>
      <Separator />
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">Type</legend>
        {PRODUCT_TYPES.map((type) => (
          <div key={type} className="flex items-center gap-2">
            <Checkbox id={`type-${type}`} checked={value.types.includes(type)} onCheckedChange={(on) => onChange({ ...value, types: toggle(value.types, type, on === true) })} />
            <Label htmlFor={`type-${type}`}>{TYPE_LABELS[type]}</Label>
          </div>
        ))}
      </fieldset>
      <Separator />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Price range</p>
        <RangeSlider
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={10}
          value={value.priceRange}
          onValueChange={(priceRange) => onChange({ ...value, priceRange })}
          thumbLabels={["Minimum price", "Maximum price"]}
        />
        <div className="text-muted-foreground flex justify-between text-sm tabular-nums">
          <span>{formatEuro(value.priceRange[0])}</span>
          <span>{formatEuro(value.priceRange[1])}</span>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <Label htmlFor="collect-from" className="font-semibold">
          Collect from
        </Label>
        <Select value={value.branch} onValueChange={(branch) => onChange({ ...value, branch })}>
          <SelectTrigger id="collect-from" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY_BRANCH}>Any branch</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.value} value={branch.value}>
                {branch.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="button" variant="ghost" size="sm" className="w-fit" disabled={count === 0} onClick={() => onChange(emptyFilters(priceBounds))}>
        Clear all
      </Button>
    </div>
  );
}

/** On a phone the same filters open from a button in a bottom sheet. */
export function StoreFiltersSheet(props: StoreFiltersProps) {
  const count = activeFilterCount(props.value, props.priceBounds);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline">
          Filters{count > 0 ? ` (${count})` : ""}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the products by metal, type, price and branch.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-4">
          <StoreFilters {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
