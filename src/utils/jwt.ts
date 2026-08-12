import type { JwtClaims } from '../types'

/**
 * Reads the JWT payload WITHOUT verifying the signature — this is only used
 * to route the UI to the right dashboard. The real check happens on the
 * backend; nothing here should be treated as a security decision.
 */
export function decodeJwt(token: string): JwtClaims | null {
    try {
        const payload = token.split('.')[1]
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
        const json = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('')
        )
        return JSON.parse(json) as JwtClaims
    } catch {
        return null
    }
}
