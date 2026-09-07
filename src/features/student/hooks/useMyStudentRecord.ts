import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchMyStudent } from '../api/studentApi'

/**
 * Kirgan o'quvchining o'z kartasi.
 *
 * `retry: false` — kirgan odam o'quvchi bo'lmasa backend xato qaytaradi,
 * uni uch marta qayta so'rashning ma'nosi yo'q.
 */
export function useMyStudentRecord(token: string) {
    return useQuery({
        queryKey: queryKeys.myStudentRecord(),
        queryFn: () => fetchMyStudent(token),
        retry: false,
        staleTime: 5 * 60_000,
    })
}
