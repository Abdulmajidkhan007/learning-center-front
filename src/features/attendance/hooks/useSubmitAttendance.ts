import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { createAttendance, type CreateAttendancePayload } from '../api/attendanceApi'

/**
 * Davomatni yuboradi va ro'yxatni yangilaydi.
 *
 * Qo'lda `setRecords` qilish o'rniga `invalidateQueries` — server nima
 * saqlaganini aynan ko'rsatadi, ekran bilan baza farq qilib qolmaydi.
 */
export function useSubmitAttendance(token: string, onSuccess?: () => void) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateAttendancePayload) => createAttendance(token, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.attendance() })
            onSuccess?.()
        },
    })
}
