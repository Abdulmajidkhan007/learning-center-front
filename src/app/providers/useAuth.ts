import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from './auth-context'

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
