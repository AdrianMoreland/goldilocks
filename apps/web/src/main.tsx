import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ErrorBoundary } from '@/components/error-boundary'
import { recordClientError } from '@/lib/error-log'

// Anything that escapes React (event handlers, timers, unawaited promises)
// goes to the error log too. ApiErrors are skipped: useApi already logged
// them and showed a toast.
function isAlreadyLogged(value: unknown): boolean {
    return typeof value === 'object' && value !== null && (value as { logged?: boolean }).logged === true
}

window.addEventListener('error', (event) => {
    if (isAlreadyLogged(event.error)) return
    recordClientError({
        kind: 'crash',
        message: event.message || 'Uncaught error',
        detail: `${event.filename}:${event.lineno}:${event.colno}\nPage: ${window.location.pathname}`,
        stack: event.error instanceof Error ? event.error.stack : undefined,
        path: window.location.pathname,
    })
})

window.addEventListener('unhandledrejection', (event) => {
    if (isAlreadyLogged(event.reason)) return
    const reason = event.reason
    recordClientError({
        kind: 'crash',
        message: reason instanceof Error ? reason.message : 'Unhandled promise rejection',
        detail: `Page: ${window.location.pathname}${reason instanceof Error ? '' : `\nReason: ${String(reason)}`}`,
        stack: reason instanceof Error ? reason.stack : undefined,
        path: window.location.pathname,
    })
})

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </ErrorBoundary>
    </StrictMode>,
)
