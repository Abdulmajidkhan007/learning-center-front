import { useQuery } from '@tanstack/react-query'
import { fetchMonthlyAttendance, queryKeys } from '@/shared/api'

/**
 * Guruhning oylik davomat yozuvlari.
 *
 * `previousMonths`: 1 — joriy oy, 2 — o'tgan oy, 3 — ikki oy oldin
 * (`fetchMonthlyAttendance` ga qarang — backend kamida 1 ni kutadi).
 */
export function useAttendanceRecords(token: string, groupId: string, previousMonths: number) {
    const query = useQuery({
        queryKey: queryKeys.attendanceMonthly(groupId, previousMonths),
        queryFn: () => fetchMonthlyAttendance(token, groupId, previousMonths),
        enabled: Boolean(groupId),
    })

    return { ...query, records: query.data ?? [] }
}
