import { demoUser, getDemoRole, json, makeToken } from './state'

export function handleAuth(path: string): Response | null {
    if (path === '/auth/refresh-token' || path === '/auth/login') {
        return json({ token: makeToken(getDemoRole()), expiry: '2099-01-01T00:00:00Z' })
    }
    if (path === '/auth/me') {
        return json(demoUser)
    }
    if (path === '/auth/change-password') {
        // Demo'da har doim muvaffaqiyatli — haqiqiy tekshiruv backendda.
        return json({ response: 'Password changed successfully' })
    }
    return null
}
