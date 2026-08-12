import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { errorMessage } from '@/shared/api'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { Brand, Button, EmptyState, ErrorBox, ThemeToggle } from '@/shared/ui'
import { AttendanceTable, type PastLessonColumn } from '../components/AttendanceTable'
import { DraftBar } from '../components/DraftBar'
import { useAttendanceDraft } from '../hooks/useAttendanceDraft'
import { useAttendanceRecords } from '../hooks/useAttendanceRecords'
import { useSubmitAttendance } from '../hooks/useSubmitAttendance'
import type { LessonDto, StudentDto } from '@/shared/types'

/** Dashboard'dan `navigate('/attendance', { state })` orqali keladigan yuk. */
interface AttendanceRouteState {
    students?: StudentDto[]
    activeLesson?: LessonDto | null
}

export function AttendancePage() {
    const session = useSession()
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const state = (location.state ?? null) as AttendanceRouteState | null
    const students = useMemo(() => state?.students ?? [], [state])
    const activeLesson = state?.activeLesson ?? null

    const { records, error } = useAttendanceRecords(session.token, students)
    const draft = useAttendanceDraft(students, activeLesson)
    const submit = useSubmitAttendance(session.token, () => {
        draft.clearDraft()
        navigate('/')
    })

    const pastColumns = useMemo<PastLessonColumn[]>(
        () =>
            records.map((record) => ({
                lessonId: record.lessonId,
                date: record.createdAt,
                attendanceStudents: record.attendanceStudents ?? [],
            })),
        [records]
    )

    function handleFinish() {
        const payload = draft.toPayload()
        if (payload) submit.mutate(payload)
    }

    const failure = submit.error ?? error

    return (
        <div className="min-h-screen bg-surface">
            <header className="border-b border-border-base bg-surface-card px-6 py-3.5 sm:px-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Brand subtitle="Cornerstone · Attendance" />
                    <div className="flex items-center gap-2.5">
                        <ThemeToggle />
                        <Button size="sm" onClick={() => navigate('/')}>
                            ← Back to Dashboard
                        </Button>
                        <Button size="sm" onClick={signOut}>
                            Sign out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="px-6 py-8 pb-16 sm:px-10">
                {failure && (
                    <div className="mb-5">
                        <ErrorBox>{errorMessage(failure)}</ErrorBox>
                    </div>
                )}

                {students.length === 0 ? (
                    <EmptyState
                        title="No students in this group"
                        description="Add students to the group to start taking attendance."
                    />
                ) : (
                    <>
                        {pastColumns.length > 0 && (
                            <p className="mb-5 font-mono text-xs text-fg-faint">
                                {pastColumns.length} past lesson{pastColumns.length !== 1 ? 's' : ''}
                            </p>
                        )}

                        {draft.hasDraft && (
                            <DraftBar
                                counts={draft.counts}
                                statuses={draft.statuses}
                                isSubmitting={submit.isPending}
                                onFinish={handleFinish}
                            />
                        )}

                        <AttendanceTable
                            students={students}
                            pastColumns={pastColumns}
                            draft={draft.draft}
                            onStatusChange={draft.setStatus}
                        />
                    </>
                )}
            </main>
        </div>
    )
}
