import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchMyAttendance } from '../api/studentApi'

export function useMyAttendance(token: string, groupId: string, previousMonths: number) {
    const query = useQuery({
        queryKey: queryKeys.myAttendance(groupId, previousMonths),
        queryFn: () => fetchMyAttendance(token, groupId, previousMonths),
        enabled: Boolean(groupId),
    })

    return { ...query, entries: query.data ?? [] }
}
