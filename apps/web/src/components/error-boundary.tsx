import * as React from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { recordClientError } from "@/lib/error-log"

interface ErrorBoundaryState {
    error: Error | null
    reference: string | null
}

/**
 * Catches a render crash anywhere below it, records it in the error log and
 * shows a recoverable screen with a reference — instead of React unmounting
 * the whole app and leaving a blank page (what the theme editor's Layout
 * tab used to do).
 */
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null, reference: null }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { error }
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        const reference = recordClientError({
            kind: "crash",
            message: `Screen crashed: ${error.message}`,
            detail: `Page: ${window.location.pathname}\nComponent stack:${info.componentStack ?? " (unavailable)"}`.slice(0, 4000),
            stack: error.stack,
            path: window.location.pathname,
        })
        this.setState({ reference })
    }

    render() {
        if (!this.state.error) return this.props.children

        return (
            <div className="bg-background text-foreground flex min-h-svh items-center justify-center p-6">
                <div className="flex max-w-md flex-col items-center gap-4 text-center">
                    <AlertTriangle className="text-destructive size-8" aria-hidden />
                    <div className="space-y-1.5">
                        <h1 className="type-h4">This screen hit an error</h1>
                        <p className="text-muted-foreground text-sm">
                            It's been recorded{this.state.reference ? ` as ${this.state.reference}` : ""}. Reload to carry on; if it keeps
                            happening, give an admin the reference so they can find it in Admin panel → Error log.
                        </p>
                    </div>
                    <p className="bg-muted text-muted-foreground w-full rounded-md px-3 py-2 text-left font-mono text-xs break-words">
                        {this.state.error.message}
                    </p>
                    <Button className="cursor-pointer" onClick={() => window.location.reload()}>
                        <RotateCcw /> Reload
                    </Button>
                </div>
            </div>
        )
    }
}
