import * as React from "react"

import { Input } from "@/components/ui/input"

interface NumberFieldOptions {
  /** The committed number; `null`/`undefined` shows an empty field (nothing entered yet). */
  value: number | null | undefined
  onValueChange: (value: number) => void
  /** What the rest of the app is told while the field is empty. */
  emptyValue?: number
  /** Shown value = stored value × scale, e.g. 100 to edit a 0.23 rate as 23 (%). */
  scale?: number
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

/**
 * Props for a number `<input>` that keeps what the user is typing as text and only reports numbers
 * upward.
 *
 * Binding `value={n}` with `onChange={(e) => set(Number(e.target.value) || 0)}` snaps the field to
 * `0` the moment it is emptied, so `0.5` cannot be typed by clearing and retyping, and `0.` loses its
 * dot. Here the text is local while editing; the committed number is reported on every keystroke
 * (an empty field reports `emptyValue`), and the text is tidied to the number on blur.
 */
export function useNumberField({ value, onValueChange, emptyValue = 0, scale = 1, onBlur }: NumberFieldOptions) {
  const format = React.useCallback(
    (n: number | null | undefined) =>
      n === null || n === undefined || !Number.isFinite(n) ? "" : String(Number((n * scale).toFixed(6))),
    [scale],
  )
  const [text, setText] = React.useState(() => format(value))

  // Follow changes that did not come from typing (a reset button, a mode switch), but leave the text
  // alone when it already means this number: "", "0." and "0.50" must survive their own echo.
  React.useEffect(() => {
    setText((current) => {
      const typed = current.trim() === "" ? emptyValue : Number(current) / scale
      const same = value === null || value === undefined ? current === "" : Math.abs(typed - value) < 1e-9
      return same ? current : format(value)
    })
  }, [value, emptyValue, scale, format])

  return {
    type: "number" as const,
    inputMode: "decimal" as const,
    value: text,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      setText(raw)
      const parsed = raw.trim() === "" ? emptyValue * scale : Number(raw)
      if (Number.isFinite(parsed)) onValueChange(parsed / scale)
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      setText(format(value))
      onBlur?.(e)
    },
  }
}

type NumberInputProps = Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "type"> &
  Omit<NumberFieldOptions, "onBlur">

/** The shared `Input` styled number field; see `useNumberField` for why it exists. */
export function NumberInput({ value, onValueChange, emptyValue, scale, onBlur, ...props }: NumberInputProps) {
  const field = useNumberField({ value, onValueChange, emptyValue, scale, onBlur })
  return <Input {...props} {...field} />
}
