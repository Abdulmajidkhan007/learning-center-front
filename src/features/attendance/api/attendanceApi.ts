import { apiFetch } from '@/shared/api'
import type { AttendanceDto, AttendanceStudentDto, MonthlyAttendanceDto, StudentDto } from '@/shared/types'

const ENDPOINT = '/attendance'
const STUDENT_ENDPOINT = '/student'

/**
 * Guruhning oylik davomati.
 *
 * `previousMonths`: 1 — joriy oy, 2 — o'tgan oy, 3 — ikki oy oldin.
 * Backend kamida 1 ni kutadi, 0 yoki manfiy qiymatda 400 qaytaradi.
 */
export async function fetchMonthlyAttendance(
    token: string,
    groupId: string,
    previousMonths: number
): Promise<MonthlyAttendanceDto[]> {
    const data = await apiFetch<MonthlyAttendanceDto[]>(`${ENDPOINT}/monthly/${groupId}`, {
        token,
        params: { previousMonths },
    })
    return data ?? []
}

/** Guruhning o'quvchilari — davomat jadvalining qatorlari shulardan tuziladi. */
export async function fetchStudentsByGroup(token: string, groupId: string): Promise<StudentDto[]> {
    const data = await apiFetch<StudentDto[]>(`${STUDENT_ENDPOINT}/${groupId}/students`, { token })
    return data ?? []
}

export interface CreateAttendancePayload {
    lessonId: string
    students: AttendanceStudentDto[]
}

export function createAttendance(token: string, payload: CreateAttendancePayload) {
    return apiFetch<AttendanceDto>(ENDPOINT, { method: 'POST', token, body: payload })
}
