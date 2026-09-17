import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchGroupStats } from '../api/teacherApi'

/**
 * O'qituvchi ko'rsatkichlari.
 *
 * `retry: false` — bu blok dashboardning yon qismi, u kelmasa ham sahifa
 * ishlashi kerak. Qayta-qayta urinish faqat yuklashni sekinlashtiradi.
 */
export function useGroupStats(token: string) {
    const query = useQuery({
        queryKey: queryKeys.groupStats(),
        queryFn: () => fetchGroupStats(token),
        retry: false,
        staleTime: 60_000,
    })

    return { stats: query.data ?? null, isLoading: query.isLoading }
}
