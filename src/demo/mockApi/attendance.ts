import type { AttendanceDto } from '@/shared/types'
import { db, json, nextId } from './state'

export function handleAttendance(
    path: string,
    method: string,
    body: Record<string, unknown>
): Response | null {
    /**
     * Guruhning oylik davomati.
     *
     * Demo'da oy bo'yicha filtrlash yo'q: mock ma'lumot bitta oyga tegishli,
     * shuning uchun `previousMonths` qabul qilinadi-yu, natijani
     * o'zgartirmaydi — ekranni ko'rsatish uchun shu yetarli.
     */
    if (path.startsWith('/attendance/monthly/') && method === 'GET') {
        const groupId = path.slice('/attendance/monthly/'.length)
        const groupLessons = db.lessons.filter((lesson) => lesson.group?.id === groupId)
        return json(
            groupLessons.map((lesson) => {
                const record = db.attendance.find((item) => item.lessonId === lesson.id)
                const attendanceStudentMap: Record<string, { status: string; reason?: string }> = {}
                for (const entry of record?.attendanceStudents ?? []) {
                    if (entry.studentId && entry.status) {
                        attendanceStudentMap[entry.studentId] = { status: entry.status, reason: entry.reason }
                    }
                }
                return {
                    // `id` — davomat yozuvining o'zi (PUT shu yerga boradi), dars emas.
                    id: record?.id ?? lesson.id,
                    lessonTitle: lesson.topic ?? lesson.title ?? '',
                    date: lesson.lessonDate?.slice(0, 10) ?? '',
                    attendanceStudentMap,
                }
            })
        )
    }
    if (path === '/attendance' && method === 'GET') return json(db.attendance)
    if (path === '/attendance' && method === 'POST') {
        const record: AttendanceDto = {
            id: nextId('a'),
            lessonId: String(body.lessonId),
            createdAt: new Date().toISOString(),
            attendanceStudents: body.students as AttendanceDto['attendanceStudents'],
        }
        db.attendance = [...db.attendance, record]
        return json(record)
    }
    if (path.startsWith('/attendance/') && method === 'PUT') {
        const id = path.slice('/attendance/'.length)
        const students = body.attendanceStudents as AttendanceDto['attendanceStudents']
        db.attendance = db.attendance.map((item) =>
            item.id === id ? { ...item, attendanceStudents: students } : item
        )
        const updated = db.attendance.find((item) => item.id === id)
        return updated ? json(updated) : json({ message: 'Attendance not found' }, 404)
    }
    return null
}
