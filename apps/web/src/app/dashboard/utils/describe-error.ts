import { ApiError } from "@/hooks/useApi"

export interface DescribedError {
    /** What went wrong, in plain words. */
    message: string
    /** What to do about it. */
    next: string
}

/** Turns a failed request into a problem + a next step, so an error in the pricing tools never ends at a bare "unable to load". */
export function describeApiError(error: unknown, what: string): DescribedError {
    if (error instanceof ApiError) {
        const ref = error.reference ? ` (ref ${error.reference})` : ""

        if (error.status === null || error.status === 0) {
            return { message: `Couldn't reach the pricing server to ${what}.`, next: "Check your connection, then try again." }
        }
        if (error.status === 401 || error.status === 403) {
            return { message: `Your session can't ${what}.`, next: "Sign out and sign back in." }
        }
        if (error.status === 404) {
            return {
                message: error.message || `No spot price is stored to ${what}.`,
                next: "Press the refresh button in the top bar to fetch live spot prices.",
            }
        }
        if (error.status === 400) {
            return { message: error.message || `Some of the values entered can't be used to ${what}.`, next: "Correct the highlighted values." }
        }
        return {
            message: `The server had a problem trying to ${what}${ref}.`,
            next: "Try again in a moment. If it keeps happening, tell an admin and quote the reference.",
        }
    }

    return {
        message: error instanceof Error && error.message ? error.message : `Couldn't ${what}.`,
        next: "Try again, or press refresh in the top bar.",
    }
}
