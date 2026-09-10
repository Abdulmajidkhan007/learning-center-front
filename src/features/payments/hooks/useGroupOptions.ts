import { useQuery } from '@tanstack/react-query'
import { fetchGroupOptions } from '../api/invoiceApi'

/** Hisob yaratish tugmasidagi guruh ro'yxati. */
export function useGroupOptions(token: string) {
    const query = useQuery({
        queryKey: ['group', 'options'] as const,
        queryFn: () => fetchGroupOptions(token),
        staleTime: 5 * 60_000,
    })
    return query.data ?? []
}
