import { Button } from "@/components/ui/button"

/** A tab that failed to load: say so plainly and offer the one useful next step. */
export function TabError({ onRetry }: { onRetry: () => void }) {
    return (
        <div role="alert" className="flex h-40 flex-col items-center justify-center gap-3 rounded-md border border-dashed text-sm">
            <p className="text-muted-foreground">Couldn&apos;t load this tab. Check your connection and try again.</p>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
                Try again
            </Button>
        </div>
    )
}
