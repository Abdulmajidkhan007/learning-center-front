import { createContext } from 'react'
import type { Session } from '@/shared/types'

export interface AuthContextValue {
    session: Session | null
    /** Login muvaffaqiyatli bo'lganda chaqiriladi. */
    signIn: (session: Session) => void
    signOut: () => void
    /** Sahifa ochilishida refresh-token tekshiruvi tugadimi. */
    isRestoring: boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
