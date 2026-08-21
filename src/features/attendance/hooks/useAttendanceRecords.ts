import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchAttendanceByGroup } from '../api/attendanceApi'

/**
 * Guruhga tegishli davomat yozuvlari — backend `/attendance/group/{groupId}`
 * orqali faqat shu guruhning yozuvlarini qaytaradi, mijozda filtrlash kerak
 * emas (boshqacha bo'lganida boshqa guruhlarning ma'lumoti ham brauzerga
 * tushib qolardi).
 */
export function useAttendanceRecords(token: string, groupId: string) {
    const query = useQuery({
        queryKey: queryKeys.attendanceByGroup(groupId),
        queryFn: () => fetchAttendanceByGroup(token, groupId),
        enabled: Boolean(groupId),
    })

    return { ...query, records: query.data ?? [] }
}
