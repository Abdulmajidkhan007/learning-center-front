import { createContext } from 'react'
import type { Session } from './types'

export interface AuthContextValue {
    session: Session
    onLogout: () => void
}

/**
 * `null` means "used outside the provider". AttendancePage reads from this
 * context in standalone mode and from props when embedded, so `null` is a
 * real, expected state rather than a bug.
 */
export const AuthContext = createContext<AuthContextValue | null>(null)
