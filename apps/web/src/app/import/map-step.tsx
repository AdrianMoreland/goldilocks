import { useState } from "react"
import { toast } from "sonner"
import { KeyRound } from "lucide-react"
import { detectFileType, type RedactionMapRow } from "@goldilocks/shared-types"
import { readSheets, headersOf } from "@/lib/workbook-file"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileDrop } from "./file-drop"

/**
 * Step one of a redacted import: the owner's private map (code -> real name). It is read in this browser tab and
 * kept in memory only. It is never uploaded, stored, or written to the address bar, local storage or logs.
 */
export function MapStep({ map, onChange }: { map: RedactionMapRow[] | null; onChange: (rows: RedactionMapRow[] | null) => void }) {
    const [reading, setReading] = useState(false)

    const load = async (file: File) => {
        if (!/\.xlsx$/i.test(file.name)) return void toast.error("Choose the map as an .xlsx file.")
        setReading(true)
        try {
            const sheets = await readSheets(file)
            if (detectFileType(headersOf(sheets)).kind !== "redaction_map") {
                toast.error("That does not look like the redaction map (it needs a tab called map with code and original columns).")
                return
            }
            const [header = [], ...rows] = sheets["map"] ?? []
            const at = (name: string) => header.findIndex((h) => String(h ?? "").trim().toLowerCase() === name)
            const [code, key, original, type] = ["code", "key", "original", "type"].map(at)
            const parsed = rows
                .map((r) => ({
                    code: String(r[code!] ?? "").trim(),
                    key: key! >= 0 ? String(r[key!] ?? "") : undefined,
                    original: String(r[original!] ?? "").trim(),
                    type: type! >= 0 ? String(r[type!] ?? "") : undefined,
                }))
                .filter((r) => r.code && r.original)
            if (parsed.length === 0) return void toast.error("The map has no names in it.")
            onChange(parsed)
        } catch (e) {
            toast.error(e instanceof Error ? e.message : "Could not read that file.")
        } finally {
            setReading(false)
        }
    }

    if (map) {
        return (
            <Card>
                <CardContent className="flex flex-wrap items-center gap-3 pt-6">
                    <KeyRound className="text-muted-foreground size-5" />
                    <span className="font-medium">Map loaded: {map.length.toLocaleString()} names</span>
                    <span className="text-muted-foreground text-sm">Kept in this browser tab only. Closing or reloading the page forgets it.</span>
                    <Button variant="outline" className="ml-auto" onClick={() => onChange(null)}>
                        Forget the map
                    </Button>
                </CardContent>
            </Card>
        )
    }
    return (
        <FileDrop
            title="Drop your redaction map here, or click to choose"
            hint="The private map file from the import script (the one with the map tab). It stays in this browser and is never sent to Goldilocks."
            busy={reading}
            onFile={(f) => void load(f)}
        />
    )
}
