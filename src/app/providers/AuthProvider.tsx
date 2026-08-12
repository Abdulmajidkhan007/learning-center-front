import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { refreshSession, toSession } from '@/features/auth/api/authApi'
import { AuthContext } from './auth-context'
import type { Session } from '@/shared/types'

/**
 * Sessiya holati.
 *
 * Token faqat React state'da yashaydi — `localStorage` da EMAS. Uzoq muddatli
 * kirish httpOnly refresh cookie orqali ta'minlanadi, ya'ni XSS token o'g'irlay
 * olmaydi. Sahifa yangilanganda `refresh-token` yangi access token beradi.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [isRestoring, setIsRestoring] = useState(true)

    useEffect(() => {
        let cancelled = false

        refreshSession()
            .then((response) => {
                if (!cancelled) setSession(toSession(response))
            })
            // 401 — cookie yo'q yoki eskirgan, ya'ni kirilmagan. Bu xato emas.
            .catch(() => {})
            .finally(() => {
                if (!cancelled) setIsRestoring(false)
            })

        return () => {
            cancelled = true
        }
    }, [])

    const signIn = useCallback((next: Session) => setSession(next), [])
    const signOut = useCallback(() => setSession(null), [])

    const value = useMemo(
        () => ({ session, signIn, signOut, isRestoring }),
        [session, signIn, signOut, isRestoring]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
