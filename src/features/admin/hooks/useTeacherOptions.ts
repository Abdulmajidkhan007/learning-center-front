import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchTeacherOptions } from '../api/adminApi'

/** Guruh formasidagi o'qituvchi tanlagichi uchun variantlar. */
export function useTeacherOptions(token: string) {
    const query = useQuery({
        queryKey: queryKeys.teacherOptions(),
        queryFn: () => fetchTeacherOptions(token),
        // Ro'yxat kamdan-kam o'zgaradi — 5 daqiqa yangi hisoblanadi.
        staleTime: 5 * 60_000,
    })
    return query.data ?? []
}
