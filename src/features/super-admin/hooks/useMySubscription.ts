import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchMySubscription } from '../api/superAdminApi'

/**
 * Markazning obunasi.
 *
 * `retry: false` — obuna hali ochilmagan markazda backend `404` qaytaradi
 * va bu normal holat, xato emas. Qayta urinish faqat kutdiradi.
 */
export function useMySubscription(token: string) {
    const query = useQuery({
        queryKey: queryKeys.mySubscription(),
        queryFn: () => fetchMySubscription(token),
        retry: false,
        staleTime: 5 * 60_000,
    })

    return { subscription: query.data ?? null, isLoading: query.isLoading }
}
