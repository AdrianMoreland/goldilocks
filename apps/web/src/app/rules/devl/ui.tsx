/**
 * The devl.dev components in this folder were written against coss ui (built on Base UI). This file gives them the
 * same component names and props, built on the app's own shadcn (Radix) components, so the copied files stay as close
 * to the originals as possible and the app keeps one set of buttons, inputs, selects and menus.
 */
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Slot } from "@radix-ui/react-slot"
import { Badge as AppBadge } from "@/components/ui/badge"
import { Button as AppButton } from "@/components/ui/button"
import { Checkbox as AppCheckbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input as AppInput } from "@/components/ui/input"
import { Kbd as AppKbd } from "@/components/ui/kbd"
import {
  Select as AppSelect,
  SelectContent,
  SelectItem as AppSelectItem,
  SelectTrigger as AppSelectTrigger,
  SelectValue as AppSelectValue,
} from "@/components/ui/select"
import { Switch as AppSwitch } from "@/components/ui/switch"
import { Tabs as AppTabs, TabsList as AppTabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea as AppTextarea } from "@/components/ui/textarea"
import {
  Tooltip as AppTooltip,
  TooltipContent,
  TooltipProvider as AppTooltipProvider,
  TooltipTrigger as AppTooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

/* ---------- render prop: Base UI's `render={<Button />}` becomes Radix `asChild` around that element ---------- */

type RenderProp = { render?: React.ReactElement }

function withRender(render: React.ReactElement | undefined, children: React.ReactNode) {
  if (!render) return children
  return React.cloneElement(render, undefined, children ?? (render.props as { children?: React.ReactNode }).children)
}

/* ---------- Button ---------- */

const buttonSizes: Record<string, string> = {
  xs: "h-7 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  sm: "",
  default: "",
  lg: "",
  icon: "",
  "icon-xs": "size-7 rounded-md p-0 [&_svg:not([class*='size-'])]:size-3.5",
  "icon-sm": "size-8 rounded-md p-0",
}

type AppButtonProps = React.ComponentProps<typeof AppButton>
export type ButtonProps = Omit<AppButtonProps, "size" | "variant"> & {
  size?: "xs" | "sm" | "default" | "lg" | "icon" | "icon-xs" | "icon-sm"
  variant?: AppButtonProps["variant"] | "destructive-outline"
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { size = "default", variant, loading, disabled, className, children, ...props },
  ref,
) {
  const destructiveOutline = variant === "destructive-outline"
  const native = size === "sm" || size === "default" || size === "lg" || size === "icon" ? size : size === "xs" ? "sm" : "icon"
  return (
    <AppButton
      aria-busy={loading || undefined}
      className={cn(
        buttonSizes[size],
        destructiveOutline && "border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive",
        className,
      )}
      disabled={disabled || loading}
      ref={ref}
      size={native}
      variant={destructiveOutline ? "outline" : variant}
      {...props}
    >
      {children}
    </AppButton>
  )
})

/* ---------- Input / Textarea ---------- */

export type InputProps = Omit<React.ComponentProps<"input">, "size"> & { size?: "sm" | "default" | "lg" | number }

/** coss ui wraps the input in a span and styles it from outside (`[&_input]:pe-9`); keep that shape. */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ size, className, ...props }, ref) {
  return (
    <span className={cn("relative inline-flex w-full", className)} data-slot="input-control">
      <AppInput
        className={cn(size === "sm" && "h-8 text-sm", size === "lg" && "h-10")}
        ref={ref}
        size={typeof size === "number" ? size : undefined}
        {...props}
      />
    </span>
  )
})

/** coss ui wraps the textarea in a span and styles it from outside (`[&_textarea]:h-49`); keep that shape. */
export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <span className={cn("relative inline-flex w-full", className)} data-slot="textarea-control">
      <AppTextarea className="w-full" {...props} />
    </span>
  )
}

/* ---------- Select ---------- */
// Base UI's select also does multi-select (`multiple`, an array value, a render function inside SelectValue). Radix's
// does not, so in that mode the same four parts render as a popover with a checkbox per option.

type SelectValueType = string | string[] | null
type SelectRootProps = {
  items?: unknown
  multiple?: boolean
  value?: SelectValueType
  defaultValue?: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches Base UI, whose value is a string or an array
  onValueChange?: (value: any) => void
  disabled?: boolean
  children?: React.ReactNode
}

type MultiState = { values: string[]; toggle: (value: string) => void }
const MultiContext = React.createContext<MultiState | null>(null)

/** Base UI shows the matching `items` label in the trigger; Radix would copy the whole item (labels and details). */
type Item = { value: unknown; label: React.ReactNode }
const ItemsContext = React.createContext<{ items: readonly Item[] | null; value: string | undefined }>({ items: null, value: undefined })

const asItems = (items: unknown): readonly Item[] | null =>
  Array.isArray(items) && items.every((i) => i && typeof i === "object" && "value" in i && "label" in i) ? (items as Item[]) : null

export function Select({ items, multiple, value, defaultValue, onValueChange, children, ...props }: SelectRootProps) {
  if (multiple) {
    const values = Array.isArray(value) ? value : []
    const toggle = (v: string) => onValueChange?.(values.includes(v) ? values.filter((x) => x !== v) : [...values, v])
    return (
      <MultiContext.Provider value={{ values, toggle }}>
        <PopoverPrimitive.Root>{children}</PopoverPrimitive.Root>
      </MultiContext.Provider>
    )
  }
  const current = typeof value === "string" ? value : undefined
  return (
    <ItemsContext.Provider value={{ items: asItems(items), value: current }}>
      <AppSelect
        defaultValue={defaultValue ?? undefined}
        onValueChange={(v) => onValueChange?.(v)}
        value={current}
        {...props}
      >
        {children}
      </AppSelect>
    </ItemsContext.Provider>
  )
}

export function SelectTrigger({
  size = "sm",
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AppSelectTrigger>, "size"> & { size?: "sm" | "default" | "lg" }) {
  const multi = React.useContext(MultiContext)
  if (multi) {
    return (
      <PopoverPrimitive.Trigger
        className={cn(
          "flex h-8 w-fit max-w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 text-sm whitespace-nowrap shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30",
          className,
        )}
        {...(props as React.ComponentProps<"button">)}
      >
        <span className="min-w-0 truncate">{children}</span>
        <span aria-hidden className="text-muted-foreground opacity-50">⌄</span>
      </PopoverPrimitive.Trigger>
    )
  }
  return (
    <AppSelectTrigger className={cn("h-8 max-w-full", className)} size={size === "sm" ? "sm" : "default"} {...props}>
      {children}
    </AppSelectTrigger>
  )
}

export function SelectValue({
  children,
  ...props
}: Omit<React.ComponentProps<typeof AppSelectValue>, "children"> & {
  children?: React.ReactNode | ((values: string[]) => React.ReactNode)
}) {
  const multi = React.useContext(MultiContext)
  const { items, value } = React.useContext(ItemsContext)
  if (multi) return <>{typeof children === "function" ? children(multi.values) : children}</>
  const label = children === undefined && items && value !== undefined ? items.find((i) => String(i.value) === value)?.label : undefined
  return <AppSelectValue {...props}>{typeof children === "function" ? undefined : (children ?? label)}</AppSelectValue>
}

export function SelectPopup({ className, children, ...props }: React.ComponentProps<typeof SelectContent>) {
  const multi = React.useContext(MultiContext)
  if (multi) {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          className={cn("z-50 max-h-72 min-w-40 overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)}
          sideOffset={4}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    )
  }
  return (
    <SelectContent className={className} position="popper" {...props}>
      {children}
    </SelectContent>
  )
}

export function SelectItem({ value, children, ...props }: React.ComponentProps<typeof AppSelectItem>) {
  const multi = React.useContext(MultiContext)
  if (multi) {
    const on = multi.values.includes(value)
    return (
      <button
        aria-pressed={on}
        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm outline-none hover:bg-accent focus-visible:bg-accent"
        onClick={() => multi.toggle(value)}
        type="button"
      >
        <AppCheckbox aria-hidden checked={on} className="pointer-events-none" tabIndex={-1} />
        {children}
      </button>
    )
  }
  return (
    <AppSelectItem value={value} {...props}>
      {children}
    </AppSelectItem>
  )
}

/* ---------- Menu ---------- */

export function Menu(props: React.ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu modal={false} {...props} />
}

export function MenuTrigger({ render, children, ...props }: RenderProp & React.ComponentProps<typeof DropdownMenuTrigger>) {
  if (render) {
    return (
      <DropdownMenuTrigger asChild {...props}>
        {withRender(render, children)}
      </DropdownMenuTrigger>
    )
  }
  return <DropdownMenuTrigger {...props}>{children}</DropdownMenuTrigger>
}

export function MenuPopup({ align = "start", ...props }: React.ComponentProps<typeof DropdownMenuContent>) {
  return <DropdownMenuContent align={align} {...props} />
}

export function MenuItem({
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof DropdownMenuItem>, "onClick"> & { onClick?: () => void }) {
  return <DropdownMenuItem onSelect={() => onClick?.()} {...props} />
}

export const MenuSeparator = DropdownMenuSeparator
export const MenuGroup = DropdownMenuGroup
export const MenuGroupLabel = DropdownMenuLabel

export function MenuRadioGroup({
  onValueChange,
  ...props
}: Omit<React.ComponentProps<typeof DropdownMenuRadioGroup>, "onValueChange"> & { onValueChange?: (value: string) => void }) {
  return <DropdownMenuRadioGroup onValueChange={(v) => onValueChange?.(v)} {...props} />
}

export function MenuRadioItem({ closeOnClick: _close, ...props }: React.ComponentProps<typeof DropdownMenuRadioItem> & { closeOnClick?: boolean }) {
  return <DropdownMenuRadioItem {...props} />
}

/* ---------- Tabs ---------- */

export function Tabs({
  onValueChange,
  ...props
}: Omit<React.ComponentProps<typeof AppTabs>, "onValueChange"> & { onValueChange?: (value: string) => void }) {
  return <AppTabs onValueChange={(v) => onValueChange?.(v)} {...props} />
}

export function TabsList({
  variant,
  size,
  className,
  ...props
}: React.ComponentProps<typeof AppTabsList> & { variant?: "default" | "underline"; size?: "sm" | "default" }) {
  return (
    <AppTabsList
      className={cn(
        size === "sm" && "h-8",
        variant === "underline" && "h-auto gap-1 rounded-none border-b bg-transparent p-0",
        className,
      )}
      {...props}
    />
  )
}

export function TabsTab({ className, ...props }: React.ComponentProps<typeof TabsTrigger>) {
  return <TabsTrigger className={cn("text-xs sm:text-sm", className)} {...props} />
}

/* ---------- Switch / Checkbox / Slider ---------- */

export function Switch({
  onCheckedChange,
  ...props
}: Omit<React.ComponentProps<typeof AppSwitch>, "onCheckedChange"> & { onCheckedChange?: (checked: boolean) => void }) {
  return <AppSwitch onCheckedChange={(c) => onCheckedChange?.(c)} {...props} />
}

export function Checkbox({
  checked,
  indeterminate,
  onCheckedChange,
  ...props
}: Omit<React.ComponentProps<typeof AppCheckbox>, "checked" | "onCheckedChange"> & {
  checked?: boolean
  indeterminate?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <AppCheckbox
      checked={indeterminate ? "indeterminate" : checked}
      onCheckedChange={(c) => onCheckedChange?.(c === true)}
      {...props}
    />
  )
}

/** Base UI's slider takes `value` as a number or a one-item array; this one keeps the track as a range input. */
export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  getAriaLabel,
  className,
}: {
  value: number | number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number | number[]) => void
  getAriaLabel?: (index: number) => string
  className?: string
}) {
  const current = Array.isArray(value) ? value[0] : value
  const pct = ((current - min) / (max - min)) * 100
  return (
    <div className={cn("relative flex h-5 w-full items-center", className)} data-slot="slider">
      <div className="relative h-1.5 w-full rounded-full bg-muted" data-slot="slider-control">
        <div className="absolute inset-y-0 start-0 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <input
        aria-label={getAriaLabel?.(0)}
        className="absolute inset-0 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background focus-visible:outline-none focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-ring"
        max={max}
        min={min}
        onChange={(e) => onValueChange?.(Array.isArray(value) ? [Number(e.target.value)] : Number(e.target.value))}
        step={step}
        type="range"
        value={current}
      />
    </div>
  )
}

/* ---------- Kbd / Badge ---------- */

export function Kbd(props: React.ComponentProps<"kbd">) {
  return <AppKbd {...props} />
}

const badgeTones: Record<string, string> = {
  success: "border-transparent bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  warning: "border-transparent bg-amber-500/14 text-amber-700 dark:text-amber-400",
  error: "border-transparent bg-red-500/12 text-red-700 dark:text-red-400",
  info: "border-transparent bg-sky-500/12 text-sky-700 dark:text-sky-400",
}

export function Badge({
  variant = "default",
  size,
  className,
  ...props
}: Omit<React.ComponentProps<typeof AppBadge>, "variant"> & {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "error" | "info"
  size?: "sm" | "default"
}) {
  const native = variant === "secondary" || variant === "outline" || variant === "destructive" ? variant : variant === "default" ? "default" : "outline"
  return (
    <AppBadge
      className={cn(badgeTones[variant], size === "sm" && "px-1.5 py-0 text-[11px] [&>svg]:size-3", className)}
      variant={native}
      {...props}
    />
  )
}

/* ---------- Tooltip ---------- */

export function TooltipProvider({ delay, ...props }: React.ComponentProps<typeof AppTooltipProvider> & { delay?: number }) {
  return <AppTooltipProvider delayDuration={delay ?? 0} {...props} />
}

export const Tooltip = AppTooltip

export function TooltipTrigger({ render, children, ...props }: RenderProp & React.ComponentProps<typeof AppTooltipTrigger>) {
  if (render) {
    return (
      <AppTooltipTrigger asChild>
        <Slot {...(props as React.HTMLAttributes<HTMLElement>)}>{withRender(render, children)}</Slot>
      </AppTooltipTrigger>
    )
  }
  return <AppTooltipTrigger {...props}>{children}</AppTooltipTrigger>
}

export const TooltipPopup = TooltipContent

/* ---------- Popover (Base UI shape used by the notification centre) ---------- */

type Placement = { align?: "start" | "center" | "end"; sideOffset?: number; collisionPadding?: number; className?: string }
const PlacementContext = React.createContext<Placement>({})

export const Popover = {
  Root: PopoverPrimitive.Root,
  Trigger: PopoverPrimitive.Trigger,
  Portal: PopoverPrimitive.Portal,
  Positioner({ children, ...placement }: Placement & { children?: React.ReactNode }) {
    return <PlacementContext.Provider value={placement}>{children}</PlacementContext.Provider>
  },
  Popup({
    className,
    initialFocus: _initialFocus,
    ...props
  }: React.ComponentProps<typeof PopoverPrimitive.Content> & { initialFocus?: (type: string) => unknown }) {
    const { align, sideOffset, collisionPadding, className: outer } = React.useContext(PlacementContext)
    return (
      <PopoverPrimitive.Content
        align={align}
        className={cn("z-50", outer, className)}
        collisionPadding={collisionPadding}
        sideOffset={sideOffset}
        {...props}
      />
    )
  },
  Title({ className, ...props }: React.ComponentProps<"h2">) {
    return <h2 className={className} {...props} />
  },
}
