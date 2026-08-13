import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchGroupOptions } from '../api/adminApi'

/** Dars formasidagi guruh tanlagichi uchun variantlar. */
export function useGroupOptions(token: string) {
    const query = useQuery({
        queryKey: queryKeys.groupOptions(),
        queryFn: () => fetchGroupOptions(token),
        // O'qituvchilar ro'yxatidagi kabi: kamdan-kam o'zgaradi.
        staleTime: 5 * 60_000,
    })
    return query.data ?? []
}
