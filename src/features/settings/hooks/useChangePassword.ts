import { useMutation } from '@tanstack/react-query'
import { changePassword } from '../api/settingsApi'
import type { ChangePasswordPayload } from '@/shared/types'

export function useChangePassword(token: string) {
    return useMutation({
        // Noto'g'ri joriy parolni qayta yuborishning ma'nosi yo'q.
        retry: false,
        mutationFn: (payload: ChangePasswordPayload) => changePassword(token, payload),
    })
}
