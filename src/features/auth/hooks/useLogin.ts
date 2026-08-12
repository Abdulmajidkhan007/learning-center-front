import { useMutation } from '@tanstack/react-query'
import { login, toSession } from '../api/authApi'
import type { LoginCredentials, Session } from '@/shared/types'

/**
 * Login mutatsiyasi.
 *
 * `retry: false` — noto'g'ri parolni qayta-qayta yuborishning ma'nosi yo'q
 * va bu backendda hisobni bloklashi mumkin.
 */
export function useLogin(onSuccess: (session: Session) => void) {
    return useMutation({
        retry: false,
        mutationFn: async (credentials: LoginCredentials) => {
            const session = toSession(await login(credentials))
            if (!session) {
                throw new Error("Logged in, but couldn't read your role from the token.")
            }
            return session
        },
        onSuccess,
    })
}
