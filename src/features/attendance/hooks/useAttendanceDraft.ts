import { useCallback, useMemo, useState } from 'react'
import {
    SELECTABLE_ATTENDANCE_STATUSES,
    type AttendanceStatus,
    type AttendanceStudentDto,
    type LessonDto,
    type StudentDto,
} from '@/shared/types'

export interface AttendanceDraft {
    lesson: LessonDto
    /** studentId → status */
    statuses: Record<string, AttendanceStatus>
    /** studentId → sabab matni (faqat EXCUSED uchun). */
    reasons: Record<string, string>
}

/** Mavjud yozuvni qayta tahrirlashda qoralamani shundan boshlab to'ldirish uchun. */
export interface AttendanceDraftInitial {
    statuses: Record<string, AttendanceStatus>
    reasons: Record<string, string>
}

/** O'qituvchi qo'lda o'zgartirgan statuslar, qaysi darsga tegishli ekani bilan. */
interface DraftEdits {
    lessonId: string
    statuses: Record<string, AttendanceStatus>
    reasons: Record<string, string>
}

function emptyCounts(): Record<AttendanceStatus, number> {
    return { PRESENT: 0, ABSENT: 0, EXCUSED: 0 }
}

/**
 * Yuborilmagan davomat qoralamasi.
 *
 * Qoralama ALOHIDA state'da saqlanmaydi — u faol dars + ro'yxatdan HOSILA
 * qilib hisoblanadi, state'da faqat qo'lda kiritilgan o'zgarishlar turadi.
 * Shu sabab:
 *  - dars yoki guruh almashganda qoralamani "tozalash" kerak emas, u o'zi
 *    yangilanadi (`edits.lessonId` mos kelmasa, o'zgarishlar e'tiborsiz);
 *  - `useEffect` ichida `setState` yo'q, ya'ni zanjirli render bo'lmaydi.
 *
 * Standart status `PRESENT`: odatda deyarli hamma keladi, o'qituvchi faqat
 * istisnolarni belgilaydi.
 *
 * `initial` — mavjud yozuvni qayta tahrirlashda boshlang'ich qiymatlar
 * (server nima qaytargan bo'lsa). Qo'lda o'zgartirilgan (`edits`) bo'lsa,
 * u ustun turadi — `initial` faqat birinchi ochilishda ishlatiladi.
 */
export function useAttendanceDraft(
    students: StudentDto[],
    activeLesson: LessonDto | null,
    initial: AttendanceDraftInitial | null = null
) {
    const [edits, setEdits] = useState<DraftEdits | null>(null)
    // Yuborilgan dars uchun qoralama qayta ochilmasligi kerak.
    const [submittedLessonId, setSubmittedLessonId] = useState<string | null>(null)

    const draft = useMemo<AttendanceDraft | null>(() => {
        if (!activeLesson || students.length === 0) return null
        if (activeLesson.id === submittedLessonId) return null

        const sameLesson = edits?.lessonId === activeLesson.id
        const appliedStatuses = sameLesson ? edits.statuses : (initial?.statuses ?? {})
        const appliedReasons = sameLesson ? edits.reasons : (initial?.reasons ?? {})
        const statuses: Record<string, AttendanceStatus> = {}
        students.forEach((student) => {
            statuses[student.id] = appliedStatuses[student.id] ?? 'PRESENT'
        })
        return { lesson: activeLesson, statuses, reasons: appliedReasons }
    }, [activeLesson, students, edits, submittedLessonId, initial])

    const setStatus = useCallback(
        (studentId: string, status: AttendanceStatus, reason?: string) => {
            if (!activeLesson) return
            setEdits((current) => {
                const sameLesson = current?.lessonId === activeLesson.id
                // Shu darsdagi BIRINCHI o'zgarish — boshqa o'quvchilarning holati
                // bo'sh joydan emas, `initial` dan (tahrirlanayotgan yozuvdan)
                // boshlanishi kerak, aks holda ular PRESENT ga qaytib qoladi.
                const baseStatuses = sameLesson ? current.statuses : (initial?.statuses ?? {})
                const baseReasons = sameLesson ? current.reasons : (initial?.reasons ?? {})
                const reasons = { ...baseReasons }
                // Sabab faqat EXCUSED bilan mantiqli — status o'zgarsa u tozalanadi,
                // aks holda eski izoh ko'rinib turaveradi.
                if (status === 'EXCUSED' && reason) reasons[studentId] = reason
                else delete reasons[studentId]

                return {
                    lessonId: activeLesson.id,
                    statuses: {
                        ...baseStatuses,
                        [studentId]: status,
                    },
                    reasons,
                }
            })
        },
        [activeLesson, initial]
    )

    const clearDraft = useCallback(() => {
        setSubmittedLessonId(activeLesson?.id ?? null)
        setEdits(null)
    }, [activeLesson])

    const counts = useMemo(() => {
        const result = emptyCounts()
        if (!draft) return result
        Object.values(draft.statuses).forEach((status) => {
            result[status] += 1
        })
        return result
    }, [draft])

    /** Backendga yuboriladigan ko'rinish — `lessonId` yaratishda, `id` tahrirlashda ishlatiladi. */
    const toPayload = useCallback(() => {
        if (!draft) return null
        return {
            lessonId: draft.lesson.id,
            students: Object.entries(draft.statuses).map(
                ([studentId, status]): AttendanceStudentDto => ({
                    studentId,
                    status,
                    reason: draft.reasons[studentId],
                })
            ),
        }
    }, [draft])

    return {
        draft,
        hasDraft: draft !== null,
        counts,
        statuses: SELECTABLE_ATTENDANCE_STATUSES,
        setStatus,
        clearDraft,
        toPayload,
    }
}
