import { apiFetch } from '@/shared/api'
import type { AttendanceDto, AttendanceStudentDto } from '@/shared/types'

const ENDPOINT = '/attendance'

/**
 * Guruh bo'yicha davomat — backend faqat shu guruhning yozuvlarini qaytaradi
 * (`List`, `Page` emas), shuning uchun mijozda qo'shimcha filtrlash kerak emas.
 */
export async function fetchAttendanceByGroup(token: string, groupId: string): Promise<AttendanceDto[]> {
    const data = await apiFetch<AttendanceDto[]>(`${ENDPOINT}/group/${groupId}`, { token })
    return data ?? []
}

export interface CreateAttendancePayload {
    lessonId: string
    students: AttendanceStudentDto[]
}

export function createAttendance(token: string, payload: CreateAttendancePayload) {
    return apiFetch<AttendanceDto>(ENDPOINT, { method: 'POST', token, body: payload })
}
