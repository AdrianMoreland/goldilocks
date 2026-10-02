import { API_URL } from '@/api/base'

/**
 * The browser's copy of the session: where the tokens live and how an expired access token is renewed.
 * Every request in the app goes through authorizedFetch, so there is one place that knows about tokens.
 *
 * Tokens sit in localStorage, so any script running on the page could read them (an XSS bug would expose
 * them). That is accepted for this closed internal tool; moving to httpOnly cookies is tracked in the
 * roadmap (0.12) together with the Entra SSO decision.
 */

const ACCESS_KEY = 'token'
const REFRESH_KEY = 'refreshToken'

/** Fired when the server has definitively rejected the session; the auth context listens and signs out. */
export const SESSION_EXPIRED_EVENT = 'goldilocks:session-expired'

function read(key: string): string | null {
    try {
        return localStorage.getItem(key)
    } catch {
        return null
    }
}

export const tokenStore = {
    getAccess: () => read(ACCESS_KEY),
    getRefresh: () => read(REFRESH_KEY),
    set(accessToken: string, refreshToken: string | null) {
        try {
            localStorage.setItem(ACCESS_KEY, accessToken)
            if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
            else localStorage.removeItem(REFRESH_KEY)
        } catch {
            // Storage blocked (private mode): the session lasts until the page is closed.
        }
    },
    clear() {
        try {
            localStorage.removeItem(ACCESS_KEY)
            localStorage.removeItem(REFRESH_KEY)
        } catch {
            // Nothing stored, nothing to clear.
        }
    },
}

let inFlight: Promise<boolean> | null = null

/**
 * Trades the refresh token for a new session. One request at a time: the provider rotates refresh
 * tokens, so two parallel refreshes would spend the same token twice and sign the user out.
 * Resolves true when new tokens are stored. Only a definite rejection (401) ends the session; a network
 * failure or a 5xx leaves the tokens alone so the next request can try again.
 */
export function refreshSession(): Promise<boolean> {
    if (!inFlight) {
        inFlight = renew().finally(() => {
            inFlight = null
        })
    }
    return inFlight
}

async function renew(): Promise<boolean> {
    const refreshToken = tokenStore.getRefresh()
    if (!refreshToken) return false

    let res: Response
    try {
        res = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        })
    } catch {
        return false
    }

    if (res.status === 401) {
        tokenStore.clear()
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
        return false
    }
    if (!res.ok) return false

    const body = (await res.json().catch(() => null)) as { accessToken?: unknown; refreshToken?: unknown } | null
    if (typeof body?.accessToken !== 'string') return false
    tokenStore.set(body.accessToken, typeof body.refreshToken === 'string' ? body.refreshToken : null)
    return true
}

/** The auth endpoints answer 401 for bad credentials; renewing the session would only mask that. */
function isAuthEndpoint(url: string): boolean {
    return /\/auth\/(login|refresh)(\?|$)/.test(url)
}

/**
 * fetch with the Bearer token attached. A 401 triggers one session refresh and one retry; if the server
 * still refuses, the 401 is returned to the caller untouched.
 */
export async function authorizedFetch(url: string, init: RequestInit = {}): Promise<Response> {
    const send = (token: string | null) => {
        const headers = new Headers(init.headers)
        if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)
        return fetch(url, { ...init, headers })
    }

    const usedToken = tokenStore.getAccess()
    const res = await send(usedToken)
    if (res.status !== 401 || isAuthEndpoint(url)) return res

    // Another tab may have renewed the session while this request was in flight: use its token
    // instead of spending the refresh token a second time.
    const currentToken = tokenStore.getAccess()
    if (currentToken && currentToken !== usedToken) return send(currentToken)

    if (!(await refreshSession())) return res
    return send(tokenStore.getAccess())
}
