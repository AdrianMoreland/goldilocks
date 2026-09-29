import { toast } from 'sonner';
import { API_URL } from '@/api/base';
import { flushClientErrors, recordClientError } from '@/lib/error-log';

/**
 * Thrown for every failed request. `logged` tells global handlers (window
 * unhandledrejection, the error boundary) that this failure is already in
 * the error log and the user already saw a toast.
 */
export class ApiError extends Error {
    readonly logged = true;

    constructor(
        message: string,
        readonly status: number | null,
        readonly reference: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/** The API's error bodies: {statusCode, message, reference?}; message may be an array (validation). */
async function readErrorBody(res: Response): Promise<{ message: string; reference: string | null; raw: string }> {
    const raw = await res.text();
    try {
        const body = JSON.parse(raw) as { message?: unknown; reference?: unknown };
        const message = Array.isArray(body.message) ? body.message.join('; ') : typeof body.message === 'string' ? body.message : '';
        return { message, reference: typeof body.reference === 'string' ? body.reference : null, raw };
    } catch {
        return { message: raw.slice(0, 300), reference: null, raw };
    }
}

/**
 * Custom hook to handle API requests with token-based authentication and error handling.
 * Provides a `request` function to make HTTP requests.
 */
export function useApi() {
    const request = async <T = any>(url: string, options?: RequestInit): Promise<T> => {
        const token = localStorage.getItem('token') || null;
        const headers = new Headers(options?.headers || {});
        if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
        const isFormData = options?.body instanceof FormData;
        if (!isFormData && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

        const finalUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
        const method = (options?.method ?? 'GET').toUpperCase();

        const send = async () => {
            try {
                return await fetch(finalUrl, { ...options, credentials: 'include', headers });
            } catch (err) {
                // fetch only rejects when no response arrived at all: API down,
                // network dropped, CORS, DNS. (It used to share one catch with
                // HTTP errors, so a server 500 also showed "Connection error".)
                if (err instanceof DOMException && err.name === 'AbortError') throw err;
                const reference = recordClientError({
                    kind: 'network',
                    message: "Couldn't reach the server",
                    detail: `${method} ${finalUrl}\n${err instanceof Error ? err.message : String(err)}\nBrowser online: ${navigator.onLine}`,
                    method,
                    path: url,
                });
                toast.error("Can't reach the server", {
                    description: `Check the connection, then try again. Ref ${reference}`,
                });
                throw new ApiError("Couldn't reach the server", null, reference);
            }
        };

        let res = await send();

        if (res.status === 401) {
            const refreshed = await tryRefresh();
            if (refreshed) {
                headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
                res = await send();
            }
        }

        if (!res.ok) {
            const { message, reference: serverReference, raw } = await readErrorBody(res);
            const serverFault = res.status >= 500;
            const reference = recordClientError({
                kind: 'http',
                severity: serverFault ? 'error' : 'warning',
                message: message || `Request failed (${res.status})`,
                detail: `${method} ${finalUrl}\n${raw.slice(0, 2000)}`,
                statusCode: res.status,
                method,
                path: url,
                // A 5xx with a reference is already in the server log — keep
                // it here for this browser's history, but don't send a copy.
                reference: serverReference ?? undefined,
                reportable: serverFault && !serverReference,
            });

            if (serverFault) {
                toast.error(message || 'Something went wrong on the server.', {
                    description: `Ref ${reference} — details in Admin panel → Error log.`,
                });
            } else {
                toast.error(message || `Request failed (${res.status})`);
            }
            throw new ApiError(message || `HTTP ${res.status}`, res.status, reference);
        }

        // The API is answering — a good moment to send anything recorded while it wasn't.
        void flushClientErrors();

        const ct = res.headers.get('Content-Type');
        return ct?.includes('application/json') ? (await res.json()) as T : (await res.text() as unknown as T);
    };

    return { request };
}

let refreshPromise: Promise<string | null> | null = null;

/**
 * Attempts to refresh the authentication token by making a POST request to the `/auth/refresh` endpoint.
 * Stores the new token in localStorage if successful.
 */
async function tryRefresh() {
    if (!refreshPromise) {
        refreshPromise = fetch(`${API_URL}/auth/refresh`, { method: 'POST', credentials: 'include' })
            .then(r => r.ok ? r.json().then(d => d.access_token) : null)
            .then(token => { if(token) localStorage.setItem('token', token); return token; })
            .catch(() => null);
    }
    const token = await refreshPromise.finally(() => refreshPromise = null);
    return !!token;
}
