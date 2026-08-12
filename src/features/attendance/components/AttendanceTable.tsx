import { DotBadge, Select } from '@/shared/ui'
import { formatDate, titleCase } from '@/shared/lib'
import { ATTENDANCE_STATUSES, type AttendanceStatus, type AttendanceStudentDto, type StudentDto } from '@/shared/types'
import { STATUS_TONE } from '../lib/attendanceStatus'
import type { AttendanceDraft } from '../hooks/useAttendanceDraft'

export interface PastLessonColumn {
    lessonId: string
    date?: string
    attendanceStudents: AttendanceStudentDto[]
}

interface AttendanceTableProps {
    students: StudentDto[]
    pastColumns: PastLessonColumn[]
    draft: AttendanceDraft | null
    onStatusChange: (studentId: string, status: AttendanceStatus) => void
}

const STATUS_OPTIONS = ATTENDANCE_STATUSES.map((status) => ({ value: status, label: titleCase(status) }))

function statusOf(studentId: string, entries: AttendanceStudentDto[]): AttendanceStatus | null {
    return entries.find((entry) => entry.studentId === studentId)?.status ?? null
}

/**
 * O'quvchilar × darslar jadvali.
 *
 * Ism ustuni `sticky left-0` — darslar ko'payganda jadval gorizontal
 * skroll bo'ladi, lekin kim haqida gapirayotganimiz ko'rinib turishi kerak.
 */
export function AttendanceTable({ students, pastColumns, draft, onStatusChange }: AttendanceTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-border-base bg-surface-card">
            <table className="min-w-full border-collapse text-sm">
                <thead>
                    <tr>
                        <th className="sticky left-0 z-20 border-b border-border-base bg-surface px-4 py-3 text-left font-mono text-[0.66rem] tracking-[0.05em] whitespace-nowrap text-fg-faint uppercase">
                            Student
                        </th>
                        {pastColumns.map((column) => (
                            <th
                                key={column.lessonId}
                                className="min-w-25 border-b border-border-base bg-surface px-3.5 py-2.5 text-center whitespace-nowrap"
                            >
                                <span className="block text-sm font-semibold text-fg-muted">
                                    {formatDate(column.date)}
                                </span>
                                <span className="block font-mono text-[0.62rem] text-fg-faint">
                                    {column.lessonId.slice(0, 8)}
                                </span>
                            </th>
                        ))}
                        {draft && (
                            <th className="min-w-28 border-b border-brand bg-brand/10 px-3.5 py-2.5 text-center whitespace-nowrap">
                                <span className="block text-sm font-semibold text-fg-muted">
                                    {formatDate(draft.lesson.lessonDate)}
                                </span>
                                <span className="block font-mono text-[0.62rem] text-fg-faint">
                                    Lesson {draft.lesson.lessonNumber}
                                </span>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student.id} className="group hover:bg-surface-hover">
                            <td className="sticky left-0 z-10 border-b border-border-base bg-surface-card px-4 py-2.5 font-display font-medium whitespace-nowrap text-fg group-hover:bg-surface-hover">
                                <span className="mr-2.5 inline-block w-5 font-mono text-xs font-bold text-accent-fg">
                                    {index + 1}
                                </span>
                                {student.userDto?.fullName || '—'}
                            </td>

                            {pastColumns.map((column) => {
                                const status = statusOf(student.id, column.attendanceStudents)
                                return (
                                    <td
                                        key={column.lessonId}
                                        className="border-b border-border-base px-3 py-2 text-center"
                                    >
                                        {status ? (
                                            <DotBadge tone={STATUS_TONE[status]}>{status.charAt(0)}</DotBadge>
                                        ) : (
                                            <span className="text-fg-faint">—</span>
                                        )}
                                    </td>
                                )
                            })}

                            {draft && (
                                <td className="border-b border-border-base px-3 py-2 text-center">
                                    <Select
                                        aria-label={`Attendance for ${student.userDto?.fullName ?? student.id}`}
                                        className="w-24 py-1.5 text-center text-xs"
                                        options={STATUS_OPTIONS}
                                        value={draft.statuses[student.id] ?? 'PRESENT'}
                                        onChange={(event) =>
                                            onStatusChange(student.id, event.target.value as AttendanceStatus)
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
