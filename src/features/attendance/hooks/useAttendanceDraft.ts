import { useCallback, useMemo, useState } from 'react'
import { ATTENDANCE_STATUSES, type AttendanceStatus, type LessonDto, type StudentDto } from '@/shared/types'

export interface AttendanceDraft {
    lesson: LessonDto
    /** studentId → status */
    statuses: Record<string, AttendanceStatus>
}

/** O'qituvchi qo'lda o'zgartirgan statuslar, qaysi darsga tegishli ekani bilan. */
interface DraftEdits {
    lessonId: string
    statuses: Record<string, AttendanceStatus>
}

function emptyCounts(): Record<AttendanceStatus, number> {
    return { PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0 }
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
 */
export function useAttendanceDraft(students: StudentDto[], activeLesson: LessonDto | null) {
    const [edits, setEdits] = useState<DraftEdits | null>(null)
    // Yuborilgan dars uchun qoralama qayta ochilmasligi kerak.
    const [submittedLessonId, setSubmittedLessonId] = useState<string | null>(null)

    const draft = useMemo<AttendanceDraft | null>(() => {
        if (!activeLesson || students.length === 0) return null
        if (activeLesson.id === submittedLessonId) return null

        const applied = edits?.lessonId === activeLesson.id ? edits.statuses : {}
        const statuses: Record<string, AttendanceStatus> = {}
        students.forEach((student) => {
            statuses[student.id] = applied[student.id] ?? 'PRESENT'
        })
        return { lesson: activeLesson, statuses }
    }, [activeLesson, students, edits, submittedLessonId])

    const setStatus = useCallback(
        (studentId: string, status: AttendanceStatus) => {
            if (!activeLesson) return
            setEdits((current) => ({
                lessonId: activeLesson.id,
                statuses: {
                    ...(current?.lessonId === activeLesson.id ? current.statuses : {}),
                    [studentId]: status,
                },
            }))
        },
        [activeLesson]
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

    /** Backendga yuboriladigan ko'rinish. */
    const toPayload = useCallback(() => {
        if (!draft) return null
        return {
            lessonId: draft.lesson.id,
            students: Object.entries(draft.statuses).map(([studentId, status]) => ({ studentId, status })),
        }
    }, [draft])

    return {
        draft,
        hasDraft: draft !== null,
        counts,
        statuses: ATTENDANCE_STATUSES,
        setStatus,
        clearDraft,
        toPayload,
    }
}
