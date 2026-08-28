import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchStudentsByGroup } from '../api/attendanceApi'

/** Guruhning o'quvchilari — davomat jadvalining qatorlari uchun. */
export function useGroupStudents(token: string, groupId: string) {
    const query = useQuery({
        queryKey: queryKeys.studentsByGroup(groupId),
        queryFn: () => fetchStudentsByGroup(token, groupId),
        enabled: Boolean(groupId),
    })

    return { ...query, students: query.data ?? [] }
}
