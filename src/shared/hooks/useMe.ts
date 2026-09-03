import { useQuery } from '@tanstack/react-query'
import { fetchMe, queryKeys } from '@/shared/api'

export function useMe(token: string) {
    return useQuery({
        queryKey: queryKeys.me(),
        queryFn: () => fetchMe(token),
        // Profil kamdan-kam o'zgaradi — har fokusda qayta so'ralmasin.
        staleTime: 5 * 60_000,
    })
}
