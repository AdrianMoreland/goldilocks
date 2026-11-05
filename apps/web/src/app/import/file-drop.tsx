import { useRef, useState, type DragEvent } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

/** A drop zone for one .xlsx file. Reading and checking the file is the caller's job. */
export function FileDrop({
    title,
    hint,
    busy,
    onFile,
}: {
    title: string
    hint: string
    busy?: boolean
    onFile: (file: File) => void
}) {
    const input = useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = useState(false)

    const take = (file: File | undefined) => {
        if (file) onFile(file)
        if (input.current) input.current.value = ""
    }
    const onDrop = (e: DragEvent) => {
        e.preventDefault()
        setDragging(false)
        take(e.dataTransfer.files[0])
    }

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => input.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
            onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors",
                dragging ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50",
            )}
        >
            <Upload className="text-muted-foreground size-8" />
            <div className="font-medium">{busy ? "Reading the file..." : title}</div>
            <p className="text-muted-foreground max-w-md text-sm">{hint}</p>
            <input ref={input} type="file" accept=".xlsx" className="hidden" onChange={(e) => take(e.target.files?.[0])} />
        </div>
    )
}
