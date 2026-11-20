import { cn } from "@/lib/utils"
import { gaugeOf, type TileItem } from "./live-stock-model"
import { LEVEL_BAR, LEVEL_NUMBER, LEVEL_WORD, LOW_PILL } from "./level-style"

/**
 * The tiles layout: one tile per bar weight and per coin, each with its count, a level bar against its low mark and
 * its state in words, so whether stock is enough is visible without comparing two numbers. Tapping a tile opens its
 * lines (refineries for a bar weight) with the usual actions.
 */
export function StockTiles({ items, onOpen }: { items: TileItem[]; onOpen: (item: TileItem) => void }) {
    const groups = [
        { kind: "BAR" as const, title: "Bars", items: items.filter((i) => i.kind === "BAR") },
        { kind: "COIN" as const, title: "Coins", items: items.filter((i) => i.kind === "COIN") },
    ].filter((g) => g.items.length > 0)
    return (
        <div className="space-y-[16px]">
            {groups.map((g) => (
                <section key={g.kind} aria-label={g.title} className="space-y-[8px]">
                    <h3 className="text-muted-foreground flex justify-between text-[12px] font-bold tracking-wider uppercase">
                        <span>{g.title}</span>
                        <span className="tabular-nums">{g.items.reduce((n, i) => n + i.qty, 0)}</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-[8px] @min-[640px]/main:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
                        {g.items.map((item) => (
                            <Tile key={item.key} item={item} onOpen={() => onOpen(item)} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}

function Tile({ item, onOpen }: { item: TileItem; onOpen: () => void }) {
    const { fill, mark } = gaugeOf(item.qty, item.lowMark)
    const word = LEVEL_WORD[item.level]
    return (
        <button
            type="button"
            onClick={onOpen}
            aria-label={`${item.label}: ${item.qty} in stock, ${word.label.toLowerCase()}${item.lowMark !== null ? `, low at ${item.lowMark}` : ""}. Open`}
            className="bg-card hover:bg-muted/50 flex min-h-[136px] min-w-0 flex-col gap-[6px] rounded-xl border p-[12px] text-left"
        >
            <span className="text-[14px] leading-tight font-bold">{item.label}</span>
            <span className={cn("text-[30px] leading-none font-extrabold tabular-nums", LEVEL_NUMBER[item.level])}>
                {item.qty}
                <span className="text-muted-foreground ml-[4px] text-[12px] font-semibold">in stock</span>
            </span>
            <span aria-hidden className="bg-muted relative mt-auto block h-[8px] rounded-full">
                <span className={cn("absolute inset-y-0 left-0 rounded-full", LEVEL_BAR[item.level])} style={{ width: `${fill}%` }} />
                {mark !== null && <span className="bg-foreground/70 absolute -inset-y-[3px] w-[2px]" style={{ left: `${mark}%` }} />}
            </span>
            <span className="text-muted-foreground flex items-center justify-between gap-[6px] text-[12px]">
                <span className={word.className}>{word.label}</span>
                {item.lowMark !== null && <span className="tabular-nums">low at {item.lowMark}</span>}
            </span>
            {item.toPick > 0 && <span className={cn(LOW_PILL, "self-start")}>{item.toPick} serials to pick</span>}
        </button>
    )
}
