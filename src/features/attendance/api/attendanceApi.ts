import { apiFetch } from '@/shared/api'
import type { AttendanceDto, AttendanceStudentDto, Page } from '@/shared/types'

const ENDPOINT = '/attendance'

/**
 * Backend ba'zan massiv, ba'zan `Page` qaytaradi — ikkalasini ham qabul
 * qilamiz va bitta massivga keltiramiz. (Kontrollerlar bir xillashtirilsa,
 * shu funksiya soddalashadi.)
 */
export async function fetchAttendance(token: string): Promise<AttendanceDto[]> {
    const data = await apiFetch<AttendanceDto[] | Page<AttendanceDto>>(ENDPOINT, {
        token,
        params: { size: 200 },
    })
    if (Array.isArray(data)) return data
    return data?.content ?? []
}

export interface CreateAttendancePayload {
    lessonId: string
    students: AttendanceStudentDto[]
}

export function createAttendance(token: string, payload: CreateAttendancePayload) {
    return apiFetch<AttendanceDto>(ENDPOINT, { method: 'POST', token, body: payload })
}
