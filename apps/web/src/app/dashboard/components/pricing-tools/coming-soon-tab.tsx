export function ComingSoonTab({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
            <div className="text-base font-semibold">{title}</div>
            <p className="text-muted-foreground max-w-xs text-sm">{description}</p>
        </div>
    )
}
