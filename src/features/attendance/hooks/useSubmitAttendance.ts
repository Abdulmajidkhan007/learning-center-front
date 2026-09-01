import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import {
    createAttendance,
    updateAttendance,
    type CreateAttendancePayload,
    type UpdateAttendancePayload,
} from '../api/attendanceApi'

/**
 * Davomatni yuboradi (yangi dars) yoki tuzatadi (o'tgan dars) va ro'yxatni
 * yangilaydi.
 *
 * Qo'lda `setRecords` qilish o'rniga `invalidateQueries` — server nima
 * saqlaganini aynan ko'rsatadi, ekran bilan baza farq qilib qolmaydi.
 *
 * Ikkalasi orasidagi farq — yuk shaklida: `lessonId` bo'lsa yangi yozuv
 * (`POST`), `id` bo'lsa mavjudini tuzatish (`PUT`).
 */
export function useSubmitAttendance(token: string, onSuccess?: () => void) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: CreateAttendancePayload | UpdateAttendancePayload) =>
            'lessonId' in payload ? createAttendance(token, payload) : updateAttendance(token, payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: queryKeys.attendance() })
            onSuccess?.()
        },
    })
}
