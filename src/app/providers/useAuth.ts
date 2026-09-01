import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from './auth-context'
import type { AdminPermission } from '@/shared/types'

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
    return context
}

/**
 * Sessiya ANIQ bor joylar uchun (dashboard'lar ProtectedRoute ichida).
 * `session` ni har safar `!` bilan tekshirmaslik uchun.
 */
export function useSession() {
    const { session } = useAuth()
    if (!session) throw new Error('useSession used outside an authenticated route')
    return session
}

/**
 * Administrator ruxsatini tekshiradi.
 *
 * `SUPER_ADMIN` da `permissions` umuman kelmaydi — u cheklovsiz, shuning
 * uchun doim `true`. Faqat `ADMINISTRATOR` panelida chaqiriladi; boshqa
 * rollarda (TEACHER, STUDENT) ruxsat tizimi ma'noga ega emas.
 */
export function useHasPermission(permission: AdminPermission): boolean {
    const session = useSession()
    if (session.role === 'SUPER_ADMIN') return true
    return session.permissions.includes(permission)
}
