/**
 * API base URL — will talk to the FastAPI backend.
 * In production, set NEXT_PUBLIC_API_URL env var.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://driverpulse-backend.onrender.com/api/v1";

async function fetchJSON<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) {
        throw new Error(`API error ${res.status}: ${res.statusText} — ${path}`);
    }
    return res.json() as Promise<T>;
}

export const api = { fetchJSON };
