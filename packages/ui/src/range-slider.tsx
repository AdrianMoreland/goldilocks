import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "./lib/utils"

type RangeSliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "value" | "defaultValue" | "onValueChange"
> & {
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  /** Screen-reader names for the two thumbs. */
  thumbLabels?: [string, string]
}

/** A two-thumb range, for filters such as a price range. The single-thumb `Slider` stays a native input. */
function RangeSlider({
  className,
  value,
  onValueChange,
  thumbLabels = ["Minimum", "Maximum"],
  ...props
}: RangeSliderProps) {
  return (
    <SliderPrimitive.Root
      data-slot="range-slider"
      value={value}
      minStepsBetweenThumbs={1}
      onValueChange={(next) => onValueChange([next[0] ?? value[0], next[1] ?? value[1]])}
      className={cn(
        "relative flex w-full touch-none items-center py-2 select-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="bg-muted relative h-1.5 w-full grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      {thumbLabels.map((label) => (
        <SliderPrimitive.Thumb
          key={label}
          aria-label={label}
          className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { RangeSlider }
