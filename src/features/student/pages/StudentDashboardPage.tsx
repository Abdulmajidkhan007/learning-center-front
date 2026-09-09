import { useMemo, useState } from 'react'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useTheme } from '@/app/providers/useTheme'
import { errorMessage } from '@/shared/api'
import { useMe } from '@/shared/hooks'
import { useT } from '@/shared/i18n'
import { AppShell, EmptyState, ErrorBox, Eyebrow, Panel } from '@/shared/ui'
import { AttendanceList, type MonthOption } from '../components/AttendanceList'
import { BalanceCard } from '../components/BalanceCard'
import { GroupCard } from '../components/GroupCard'
import { GroupPicker } from '../components/GroupPicker'
import { ProfileCard } from '../components/ProfileCard'
import { useMyAttendance } from '../hooks/useMyAttendance'
import { useMyGroups } from '../hooks/useMyGroups'
import { useMyStudentRecord } from '../hooks/useMyStudentRecord'

/**
 * O'quvchi paneli.
 *
 * Balans butun o'quvchiga tegishli, guruhga emas: to'lovlar `Student.balance`
 * ga qo'shilib boradi. Manfiy son qarzni bildiradi.
 */
export function StudentDashboardPage() {
    const { t } = useT()
    const { signOut } = useAuth()
    const session = useSession()
    const { theme, toggleTheme } = useTheme()

    // Bo'sh satr = "hali tanlanmagan"; bunda ro'yxatdagi birinchi guruh olinadi.
    const [pickedGroupId, setPickedGroupId] = useState('')
    const [month, setMonth] = useState<MonthOption>('1')

    const { data: me, isLoading, error } = useMe(session.token)

    const groupsQuery = useMyGroups(session.token)
    const groups = useMemo(() => groupsQuery.data ?? [], [groupsQuery.data])

    // Tanlangan guruh ro'yxatdan tushib qolsa, birinchisiga o'tamiz — o'quvchi
    // bitta guruhda bo'lsa bu qiymat o'zi shu guruh bo'lib qoladi.
    const selectedGroupId = groups.some((group) => group.id === pickedGroupId)
        ? pickedGroupId
        : (groups[0]?.id ?? '')
    const selectedGroup = groups.find((group) => group.id === selectedGroupId)

    const { data: student, error: studentError } = useMyStudentRecord(session.token)
    const attendanceQuery = useMyAttendance(session.token, selectedGroupId, Number(month))

    return (
        <AppShell
            subtitle={t('student.role')}
            onSignOut={signOut}
            token={session.token}
            theme={theme}
            toggleTheme={toggleTheme}
        >
            <div className="mx-auto max-w-2xl">
                {isLoading && (
                    <Panel className="mb-5 py-8 text-center font-mono text-sm text-fg-faint">
                        {t('common.loading')}
                    </Panel>
                )}

                {error != null && (
                    <div className="mb-5">
                        <ErrorBox>{errorMessage(error)}</ErrorBox>
                    </div>
                )}

                {!isLoading && me && <ProfileCard user={me} student={student ?? null} />}

                {!isLoading && me && studentError != null && (
                    <div className="mb-5">
                        <EmptyState title={t('student.notFound')} description={t('student.notFoundHint')} />
                    </div>
                )}

                <Panel className="mb-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <Eyebrow>{t('student.group')}</Eyebrow>
                            <p className="mt-1 text-sm text-fg-muted">{t('student.groupHint')}</p>
                        </div>
                        <GroupPicker groups={groups} selectedId={selectedGroupId} onSelect={setPickedGroupId} />
                    </div>

                    {groupsQuery.isLoading && (
                        <p className="py-4 text-center font-mono text-sm text-fg-faint">{t('common.loading')}</p>
                    )}

                    {groupsQuery.error != null && <ErrorBox>{errorMessage(groupsQuery.error)}</ErrorBox>}

                    {!groupsQuery.isLoading && groupsQuery.error == null && selectedGroup && (
                        <GroupCard group={selectedGroup} />
                    )}

                    {!groupsQuery.isLoading && groupsQuery.error == null && !selectedGroup && (
                        <EmptyState title={t('student.noGroups')} description={t('student.noGroupsHint')} />
                    )}
                </Panel>

                <Panel className="mb-5">
                    <Eyebrow>{t('student.attendance')}</Eyebrow>
                    <p className="mt-1 mb-4 text-sm text-fg-muted">{t('student.attendanceHint')}</p>

                    {selectedGroup ? (
                        <AttendanceList
                            entries={attendanceQuery.entries}
                            isLoading={attendanceQuery.isLoading}
                            month={month}
                            onMonthChange={setMonth}
                        />
                    ) : (
                        <EmptyState title={t('student.noGroups')} />
                    )}
                </Panel>

                <BalanceCard student={student ?? null} hasGroup={Boolean(selectedGroup)} />
            </div>
        </AppShell>
    )
}
