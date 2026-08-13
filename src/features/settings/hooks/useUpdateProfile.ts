import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { updateProfile } from '../api/settingsApi'
import type { UserUpdatePayload } from '@/shared/types'

export function useUpdateProfile(token: string, userId: string | undefined) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: UserUpdatePayload) => {
            // Tugma `userId` kelguncha o'chirilgan bo'ladi; bu himoya chorasi.
            if (!userId) throw new Error('User id is not loaded yet')
            return updateProfile(token, userId, payload)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.me() }),
    })
}
