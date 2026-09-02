import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchMyGroups } from '../api/studentApi'

export function useMyGroups(token: string) {
    return useQuery({
        queryKey: queryKeys.myGroups(),
        queryFn: () => fetchMyGroups(token),
    })
}
