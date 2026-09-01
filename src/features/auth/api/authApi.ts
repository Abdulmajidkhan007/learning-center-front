import { apiFetch } from '@/shared/api'
import { decodeJwt } from '@/shared/lib'
import type { AuthResponse, LoginCredentials, Session } from '@/shared/types'

export function login(credentials: LoginCredentials) {
    return apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: credentials })
}

/**
 * httpOnly refresh cookie orqali yangi access token oladi.
 * Cookie bo'lmasa backend 401 qaytaradi — bu normal holat (kirilmagan).
 */
export function refreshSession() {
    return apiFetch<AuthResponse>('/auth/refresh-token', { method: 'POST' })
}

/**
 * Token javobidan sessiya yasaydi.
 * Rolni o'qib bo'lmasa `null` — chaqiruvchi buni xato deb ko'rsatadi.
 */
export function toSession(response: AuthResponse | null): Session | null {
    if (!response?.token) return null
    const claims = decodeJwt(response.token)
    if (!claims?.role) return null
    return { token: response.token, role: claims.role, claims, permissions: claims.permissions ?? [] }
}
