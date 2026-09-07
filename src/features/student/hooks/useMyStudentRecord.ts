import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchMyStudent } from '../api/studentApi'

/**
 * Kirgan o'quvchining o'z kartasi — tanlangan guruh bo'yicha.
 *
 * `groupId` MAJBURIY: backend balansni `Enrollment` dan oladi, ya'ni
 * o'quvchi qaysi guruhda ekani aytilmasa javob berolmaydi. Guruh
 * tanlanmaguncha so'rov yuborilmaydi.
 *
 * `retry: false` — o'quvchi o'sha guruhda bo'lmasa backend 404 qaytaradi,
 * uni uch marta qayta so'rashning ma'nosi yo'q.
 */
export function useMyStudentRecord(token: string, groupId: string) {
    return useQuery({
        queryKey: queryKeys.myStudentRecord(groupId),
        queryFn: () => fetchMyStudent(token, groupId),
        enabled: Boolean(groupId),
        retry: false,
        staleTime: 5 * 60_000,
    })
}
