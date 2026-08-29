import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { errorMessage } from '@/shared/api'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useT } from '@/shared/i18n'
import { AppShell, Button, EmptyState, ErrorBox, SegmentedControl } from '@/shared/ui'
import { AttendanceTable, type PastLessonColumn } from '../components/AttendanceTable'
import { DraftBar } from '../components/DraftBar'
import { useAttendanceDraft } from '../hooks/useAttendanceDraft'
import { useAttendanceRecords } from '../hooks/useAttendanceRecords'
import { useGroupStudents } from '../hooks/useGroupStudents'
import { useSubmitAttendance } from '../hooks/useSubmitAttendance'
import type { LessonDto } from '@/shared/types'

/** Dashboard'dan `navigate('/attendance', { state })` orqali keladigan yuk. */
interface AttendanceRouteState {
    activeLesson?: LessonDto | null
    groupId?: string
}

/** Oy tanlagich qiymati — `fetchMonthlyAttendance` ning `previousMonths` iga to'g'ridan-to'g'ri o'tadi. */
type MonthOption = '1' | '2' | '3'

export function AttendancePage() {
    const { t } = useT()
    const session = useSession()
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const state = (location.state ?? null) as AttendanceRouteState | null
    const activeLesson = state?.activeLesson ?? null
    const groupId = state?.groupId ?? ''

    const [month, setMonth] = useState<MonthOption>('1')

    const studentsQuery = useGroupStudents(session.token, groupId)
    const recordsQuery = useAttendanceRecords(session.token, groupId, Number(month))
    const students = studentsQuery.students

    const draft = useAttendanceDraft(students, activeLesson)
    const submit = useSubmitAttendance(session.token, () => {
        draft.clearDraft()
        navigate('/')
    })

    const pastColumns = useMemo<PastLessonColumn[]>(
        () =>
            recordsQuery.records.map((record) => ({
                lessonId: record.id,
                lessonTitle: record.lessonTitle,
                date: record.date,
                attendanceMap: record.attendanceStudentMap ?? {},
            })),
        [recordsQuery.records]
    )

    function handleFinish() {
        const payload = draft.toPayload()
        if (payload) submit.mutate(payload)
    }

    const isLoading = studentsQuery.isLoading || recordsQuery.isLoading
    const failure = submit.error ?? studentsQuery.error ?? recordsQuery.error

    return (
        <AppShell
            subtitle={t('attendance.title')}
            onSignOut={signOut}
            actions={
                <>
                    <SegmentedControl<MonthOption>
                        label={t('attendance.monthFilter')}
                        value={month}
                        onChange={setMonth}
                        options={[
                            { value: '1', label: t('attendance.monthCurrent') },
                            { value: '2', label: t('attendance.monthPrevious') },
                            { value: '3', label: t('attendance.monthTwoAgo') },
                        ]}
                    />
                    <Button size="sm" onClick={() => navigate('/')}>
                        ← {t('attendance.backToDashboard')}
                    </Button>
                </>
            }
        >
            {failure && (
                <div className="mb-5">
                    <ErrorBox>{errorMessage(failure)}</ErrorBox>
                </div>
            )}

            {isLoading && <p className="font-mono text-sm text-fg-faint">{t('common.loading')}</p>}

            {!isLoading && students.length === 0 && (
                <EmptyState
                    title={t('attendance.noStudents')}
                    description={t('attendance.noStudentsHint')}
                />
            )}

            {!isLoading && students.length > 0 && (
                <>
                    {pastColumns.length > 0 && (
                        <p className="mb-4 font-mono text-xs text-fg-faint">
                            {t('attendance.pastLessons', { count: pastColumns.length })}
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
        </AppShell>
    )
}
