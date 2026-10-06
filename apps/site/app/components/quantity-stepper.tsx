import { useEffect, useState } from "react";
import { Button } from "@goldilocks/ui/button";
import { Input } from "@goldilocks/ui/input";

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  disabled?: boolean;
}

/** A whole-number quantity: minus and plus buttons around a field that can be cleared and retyped. */
export function QuantityStepper({ value, onChange, min = 1, max = 99, label = "Quantity", disabled }: QuantityStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n)));
  const [text, setText] = useState(String(value));

  useEffect(() => setText(String(value)), [value]);

  const commit = () => {
    const parsed = Number(text);
    const next = text.trim() === "" || Number.isNaN(parsed) ? value : clamp(parsed);
    setText(String(next));
    if (next !== value) onChange(next);
  };

  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <Button type="button" variant="outline" size="sm" aria-label="Decrease quantity" disabled={disabled || value <= min} onClick={() => onChange(clamp(value - 1))}>
        −
      </Button>
      <Input
        inputMode="numeric"
        aria-label={label}
        disabled={disabled}
        value={text}
        onChange={(event) => setText(event.target.value.replace(/[^\d]/g, ""))}
        onBlur={commit}
        onKeyDown={(event) => event.key === "Enter" && commit()}
        className="h-8 w-12 px-1 text-center tabular-nums"
      />
      <Button type="button" variant="outline" size="sm" aria-label="Increase quantity" disabled={disabled || value >= max} onClick={() => onChange(clamp(value + 1))}>
        +
      </Button>
    </div>
  );
}
