import { toast } from 'sonner';
import { API_URL } from '@/api/base';

/**
 * Custom hook to handle API requests with token-based authentication and error handling.
 * Provides a `request` function to make HTTP requests.
 */
export function useApi() {
    // const navigate = useNavigate();

    /**
     * Makes an HTTP request with optional headers and body.
     * Automatically includes an Authorization header if a token is available in localStorage.
     * Handles token refresh on 401 responses and displays error messages using `toast`.
     *
     * @template T - The expected response type.
     * @param {string} url - The endpoint URL (relative or absolute).
     * @param {RequestInit} [options] - Optional fetch options (e.g., method, headers, body).
     * @returns {Promise<T>} - The parsed response data.
     * @throws {Error} - Throws an error if the request fails or the response is not OK.
     */
    const request = async <T = any>(url: string, options?: RequestInit): Promise<T> => {
        try {
            const token = localStorage.getItem('token') || null;
            const headers = new Headers(options?.headers || {});

            // Add Authorization header if token exists and is not already set.
            if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);

            // Set Content-Type header to JSON unless the body is FormData.
            const isFormData = options?.body instanceof FormData;
            if (!isFormData && !headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json');
            }

            // Construct the final URL (absolute or relative to API_URL).
            const finalUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
            let res = await fetch(finalUrl, { ...options, credentials: 'include', headers });

            // Attempt token refresh if the response status is 401 (Unauthorized).
            if (res.status === 401) {
                const refreshed = await tryRefresh();
                if (refreshed) res = await fetch(finalUrl, { ...options, credentials: 'include', headers });
            }

            // Handle non-OK responses by displaying an error toast and throwing an error.
            if (!res.ok) {
                const text = await res.text();
                toast.error(text || `Error ${res.status}`);
                throw new Error(text || `HTTP ${res.status}`);
            }

            // Parse and return the response based on its Content-Type.
            const ct = res.headers.get('Content-Type');
            return ct?.includes('application/json') ? (await res.json()) as T : (await res.text() as unknown as T);
        } catch (err) {
            toast.error('Connection error');
            throw err;
        }
    };

    return { request };
}

let refreshPromise: Promise<string | null> | null = null;

/**
 * Attempts to refresh the authentication token by making a POST request to the `/auth/refresh` endpoint.
 * Stores the new token in localStorage if successful.
 *
 * @returns {Promise<boolean>} - Resolves to `true` if the token was refreshed successfully, otherwise `false`.
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