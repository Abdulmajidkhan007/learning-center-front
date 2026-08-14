import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchStudentByPhone } from '../api/studentApi'

/**
 * Kirgan o'quvchining o'z kartasi.
 *
 * `/auth/me` dan kelgan telefon raqami bo'yicha izlanadi, shuning uchun
 * telefon ma'lum bo'lmaguncha so'rov yuborilmaydi.
 */
export function useMyStudentRecord(token: string, phone: string | undefined) {
    return useQuery({
        queryKey: queryKeys.myStudentRecord(phone ?? ''),
        queryFn: () => fetchStudentByPhone(token, phone!),
        enabled: Boolean(phone),
        staleTime: 5 * 60_000,
    })
}
