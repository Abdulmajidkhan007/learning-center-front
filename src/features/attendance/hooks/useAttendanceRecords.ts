import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchAttendance } from '../api/attendanceApi'
import type { AttendanceDto, StudentDto } from '@/shared/types'

/**
 * Guruhga tegishli davomat yozuvlari.
 *
 * Backendda "guruh bo'yicha" filtr yo'q, shuning uchun hammasi olinib,
 * mijozda filtrlanadi. Endpoint qo'shilsa, filtrlash shu yerdan olib
 * tashlanadi — sahifaga tegilmaydi.
 */
export function useAttendanceRecords(token: string, students: StudentDto[]) {
    const query = useQuery({
        queryKey: queryKeys.attendance(),
        queryFn: () => fetchAttendance(token),
        enabled: students.length > 0,
    })

    const studentIds = useMemo(() => new Set(students.map((student) => student.id)), [students])

    const records = useMemo<AttendanceDto[]>(() => {
        if (!query.data) return []
        return query.data.filter((record) =>
            (record.attendanceStudents ?? []).some((entry) => studentIds.has(entry.studentId))
        )
    }, [query.data, studentIds])

    return { ...query, records }
}
