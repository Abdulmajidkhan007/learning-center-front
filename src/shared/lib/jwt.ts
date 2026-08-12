import type { JwtClaims } from '@/shared/types'

/**
 * JWT payload'ini imzoni TEKSHIRMASDAN ochadi.
 *
 * Bu faqat UI'ni kerakli dashboardga yo'naltirish uchun. Haqiqiy avtorizatsiya
 * backendda — bu yerdagi natijaga qarab hech qanday xavfsizlik qarori qabul
 * qilinmasligi kerak.
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
