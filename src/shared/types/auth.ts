/**
 * Administrator ruxsatlari — faqat `ADMINISTRATOR` rolida ma'noga ega.
 * `SUPER_ADMIN` da bu ro'yxat umuman kelmaydi (unga cheklov yo'q).
 */
export const ADMIN_PERMISSIONS = [
    'LEAD_MANAGEMENT',
    'TEACHER_MANAGEMENT',
    'STUDENT_MANAGEMENT',
    'INVOICE_MANAGEMENT',
] as const
export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number]

/**
 * JWT ichidagi claim'lar. `role` ataylab oddiy string: backend yangi rol
 * qo'shsa build yiqilmasligi, balki App'dagi `default` shoxiga tushishi kerak.
 */
export interface JwtClaims {
    role?: string
    permissions?: AdminPermission[]
    [claim: string]: unknown
}

/** Tizimga kirgan foydalanuvchi sessiyasi. */
export interface Session {
    token: string
    role: string
    claims: JwtClaims
    /** Faqat `ADMINISTRATOR` uchun ma'noli; boshqa rollarda bo'sh massiv. */
    permissions: AdminPermission[]
}

/**
 * `POST /auth/login` va `/auth/refresh-token` javobi.
 *
 * Refresh token javob TANASIDA kelmaydi — backend uni httpOnly
 * `refresh_token` cookie'siga yozadi (`AuthService.setRefreshCookie`).
 */
export interface AuthResponse {
    token: string
    expiry?: string
}

export interface LoginCredentials {
    phone: string
    password: string
    rememberMe: boolean
}

export type Role = 'SUPER_ADMIN' | 'ADMINISTRATOR' | 'TEACHER' | 'STUDENT'
