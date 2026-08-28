import { useT } from '@/shared/i18n'
import { DotBadge } from '@/shared/ui'
import { formatDate } from '@/shared/lib'
import type { AttendanceStatus, StudentDto } from '@/shared/types'
import { STATUS_TONE } from '../lib/attendanceStatus'
import { AttendanceCell } from './AttendanceCell'
import type { AttendanceDraft } from '../hooks/useAttendanceDraft'

export interface PastLessonColumn {
    lessonId: string
    lessonTitle?: string
    date?: string
    /** studentId → status. Xaritada yo'q o'quvchi hali belgilanmagan, "kelmadi" EMAS. */
    attendanceMap: Record<string, AttendanceStatus>
}

interface AttendanceTableProps {
    students: StudentDto[]
    pastColumns: PastLessonColumn[]
    /** `null` — faqat ko'rish rejimi (dashboarddagi kabi). */
    draft?: AttendanceDraft | null
    onStatusChange?: (studentId: string, status: AttendanceStatus, reason?: string) => void
    /** Ism ustiga bosilganda — o'quvchi kartasi. */
    onSelectStudent?: (student: StudentDto) => void
}

/**
 * O'quvchilar × darslar jadvali.
 *
 * Ism ustuni `sticky left-0` — darslar ko'payganda jadval gorizontal
 * siljiydi, lekin kim haqida gapirayotganimiz ko'rinib turishi kerak.
 */
export function AttendanceTable({
    students,
    pastColumns,
    draft = null,
    onStatusChange,
    onSelectStudent,
}: AttendanceTableProps) {
    const { t } = useT()

    return (
        <div className="overflow-x-auto rounded-lg border border-border-base bg-surface-card">
            <table className="min-w-full border-collapse text-sm">
                <thead>
                    <tr>
                        <th className="sticky left-0 z-20 border-b border-border-base bg-surface px-4 py-3 text-left font-mono text-[0.66rem] tracking-[0.05em] whitespace-nowrap text-fg-faint uppercase">
                            {t('attendance.student')}
                        </th>
                        {pastColumns.map((column) => (
                            <th
                                key={column.lessonId}
                                className="min-w-25 border-b border-border-base bg-surface px-3.5 py-2.5 text-center whitespace-nowrap"
                            >
                                <span className="block text-sm font-semibold text-fg-muted">
                                    {column.lessonTitle}
                                </span>
                                <span className="block font-mono text-[0.62rem] tabular-nums text-fg-faint">
                                    {formatDate(column.date)}
                                </span>
                            </th>
                        ))}
                        {draft && (
                            <th className="min-w-28 border-b border-brand bg-brand/10 px-3.5 py-2.5 text-center whitespace-nowrap">
                                <span className="block text-sm font-semibold tabular-nums text-fg-muted">
                                    {formatDate(draft.lesson.lessonDate)}
                                </span>
                                <span className="block font-mono text-[0.62rem] text-fg-faint">
                                    {t('attendance.lessonNumber', { number: draft.lesson.lessonNumber ?? '' })}
                                </span>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student.id} className="group hover:bg-surface-hover">
                            <td className="sticky left-0 z-10 border-b border-border-base bg-surface-card px-4 py-2.5 whitespace-nowrap group-hover:bg-surface-hover">
                                <span className="mr-2.5 inline-block w-5 font-mono text-xs font-bold tabular-nums text-accent-fg">
                                    {index + 1}
                                </span>
                                {onSelectStudent ? (
                                    <button
                                        type="button"
                                        onClick={() => onSelectStudent(student)}
                                        className="cursor-pointer font-display font-medium text-fg hover:underline"
                                    >
                                        {student.userDto?.fullName || '—'}
                                    </button>
                                ) : (
                                    <span className="font-display font-medium text-fg">
                                        {student.userDto?.fullName || '—'}
                                    </span>
                                )}
                            </td>

                            {pastColumns.map((column) => {
                                const status = column.attendanceMap[student.id]
                                return (
                                    <td
                                        key={column.lessonId}
                                        className="border-b border-border-base px-3 py-2 text-center"
                                    >
                                        {/* Xaritada yo'q o'quvchi — katak bo'sh va rangsiz qoladi, bu
                                            "kelmadi" bilan chalkashmasligi kerak. */}
                                        {status && <DotBadge tone={STATUS_TONE[status]}>{status.charAt(0)}</DotBadge>}
                                    </td>
                                )
                            })}

                            {draft && onStatusChange && (
                                <td className="border-b border-border-base px-3 py-2 text-center">
                                    <AttendanceCell
                                        studentName={student.userDto?.fullName ?? student.id}
                                        status={draft.statuses[student.id] ?? 'PRESENT'}
                                        reason={draft.reasons[student.id]}
                                        onChange={(status, reason) =>
                                            onStatusChange(student.id, status, reason)
                                        }
                                    />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
