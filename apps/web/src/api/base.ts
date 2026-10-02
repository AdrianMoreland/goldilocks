export const API_URL: string =
    (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ||
    "http://localhost:4000";
