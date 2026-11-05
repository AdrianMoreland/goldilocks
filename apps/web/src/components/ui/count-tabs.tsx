import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export interface CountTabItem {
    value: string
    label: string
    /** Shown after the label in tabular figures, for example "Open 5". */
    count?: number
}

interface CountTabsProps {
    value: string
    onValueChange: (value: string) => void
    items: CountTabItem[]
    "aria-label": string
    className?: string
}

/** Underline tabs with a count, for filtering a list. The active tab takes the theme's primary colour on its underline. */
export function CountTabs({ value, onValueChange, items, className, "aria-label": ariaLabel }: CountTabsProps) {
    return (
        <Tabs value={value} onValueChange={onValueChange} className={cn("gap-0", className)}>
            <TabsList aria-label={ariaLabel} className="h-auto w-full justify-start gap-5 overflow-x-auto rounded-none border-b bg-transparent p-0">
                {items.map((item) => (
                    <TabsTrigger
                        key={item.value}
                        value={item.value}
                        className={cn(
                            "text-muted-foreground flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pt-1 pb-2 shadow-none",
                            "data-[state=active]:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                            "dark:text-muted-foreground dark:data-[state=active]:text-foreground dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent",
                        )}
                    >
                        {item.label}
                        {item.count !== undefined && <span className="text-muted-foreground text-xs font-normal tabular-nums">{item.count}</span>}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}
