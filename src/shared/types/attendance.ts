/**
 * Davomat statuslari.
 *
 * Backenddan `LATE` o'chirilgan — yangi yozuvlarda faqat uch status
 * qoladi, chunki kechikish holati endi alohida ma'lumot emas.
 */
export const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'EXCUSED'] as const
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]

/** O'qituvchi yangi davomatda tanlay oladigan statuslar. */
export const SELECTABLE_ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'EXCUSED'] as const
export type SelectableAttendanceStatus = (typeof SELECTABLE_ATTENDANCE_STATUSES)[number]

export interface AttendanceStudentDto {
    studentId: string
    studentFullName?: string
    status: AttendanceStatus
    /** Faqat EXCUSED uchun mantiqiy — backend boshqa statuslarda ham qabul qiladi. */
    reason?: string
}

export interface AttendanceDto {
    id?: string
    lessonId: string
    /** `LocalDateTime`; jadvaldagi ustun sanasi shundan olinadi. */
    createdAt?: string
    attendanceStudents?: AttendanceStudentDto[]
}

/** `attendanceStudentMap` dagi bitta yozuv. */
export interface StatusReasonDto {
    status: AttendanceStatus
    reason?: string
}

/**
 * `GET /attendance/monthly/{groupId}` javobi — bitta o'tgan darsning
 * davomati.
 *
 * `attendanceStudentMap` massiv emas, xarita: kalit — `studentId`. Xaritada
 * yo'q o'quvchi hali belgilanmagan degani, "kelmadi" EMAS — jadval katagi
 * shu farqni bo'sh qoldirib ko'rsatishi kerak.
 *
 * `id` — bu yozuvning o'zi identifikatori (`PUT /attendance/{id}` shu yerga
 * yuboriladi), dars identifikatori EMAS.
 */
export interface MonthlyAttendanceDto {
    id: string
    lessonTitle?: string
    /** `LocalDate`/`LocalDateTime` — jadvaldagi ustun sanasi shundan olinadi. */
    date?: string
    attendanceStudentMap?: Record<string, StatusReasonDto>
}

/**
 * `GET /attendance/my/{groupId}` javobidagi bitta yozuv.
 *
 * `MonthlyAttendanceDto` dan farqli o'laroq — bu allaqachon SO'RAGAN
 * o'quvchining o'zi uchun tekislangan ro'yxat, xarita emas.
 */
export interface MyAttendanceDto {
    title?: string
    /** `LocalDate` — "yyyy-MM-dd". */
    date?: string
    status: AttendanceStatus
    reason?: string
}
