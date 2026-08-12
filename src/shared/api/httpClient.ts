import { ApiError } from './ApiError'

const API_PREFIX = '/api/v1'

interface RequestOptions extends Omit<RequestInit, 'body'> {
    /** JWT access token; berilsa `Authorization` sarlavhasi qo'shiladi. */
    token?: string
    /** Obyekt sifatida beriladi — JSON.stringify o'zi bajariladi. */
    body?: unknown
    /** Query parametrlari; `undefined`/`''` qiymatlar tushirib qoldiriladi. */
    params?: Record<string, string | number | undefined | null>
}

function buildUrl(path: string, params?: RequestOptions['params']): string {
    const url = path.startsWith('/api') ? path : `${API_PREFIX}${path}`
    if (!params) return url
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') continue
        search.set(key, String(value))
    }
    const query = search.toString()
    return query ? `${url}?${query}` : url
}

/**
 * Loyihadagi yagona HTTP mijozi.
 *
 * Ilgari har bir sahifada o'zining `authFetch` nusxasi bor edi — endi bitta.
 * Ikkita nozik joyni yodda tuting:
 *  - `credentials: 'include'` shart, chunki refresh token httpOnly cookie'da;
 *  - ba'zi endpoint'lar 200 qaytarib, tanani BO'SH qoldiradi (204 ham emas),
 *    `res.json()` esa bunda xato beradi — shuning uchun avval matn o'qiladi.
 *
 * Xato bo'lsa `ApiError` otiladi, ya'ni TanStack Query uni o'zi ushlaydi.
 */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T | null> {
    const { token, body, params, headers, ...rest } = options

    const res = await fetch(buildUrl(path, params), {
        ...rest,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })

    if (!res.ok) {
        throw new ApiError(await readErrorMessage(res), res.status)
    }

    const text = await res.text()
    if (!text) return null
    try {
        return JSON.parse(text) as T
    } catch {
        return null
    }
}

async function readErrorMessage(res: Response): Promise<string> {
    try {
        const body = (await res.json()) as { message?: string; error?: string }
        return body.message || body.error || `Request failed (${res.status})`
    } catch {
        return `Request failed (${res.status})`
    }
}

/** Xato obyektidan foydalanuvchiga ko'rsatiladigan matnni oladi. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Try again.'): string {
    if (error instanceof Error && error.message) return error.message
    return fallback
}
