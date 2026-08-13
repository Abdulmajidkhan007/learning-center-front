import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchMe } from '../api/settingsApi'

export function useMe(token: string) {
    return useQuery({
        queryKey: queryKeys.me(),
        queryFn: () => fetchMe(token),
        // Profil kamdan-kam o'zgaradi — har fokusda qayta so'ralmasin.
        staleTime: 5 * 60_000,
    })
}
