import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useTheme } from '@/app/providers/useTheme'
import { errorMessage } from '@/shared/api'
import { useMe } from '@/shared/hooks'
import { useT } from '@/shared/i18n'
import { AppShell, Button, EmptyState, ErrorBox, Panel } from '@/shared/ui'
import type { MonthOption } from '../components/AttendanceList'
import { BalanceCard } from '../components/BalanceCard'
import { CollapsibleSection } from '../components/CollapsibleSection'
import { GroupAttendanceSection } from '../components/GroupAttendanceSection'
import { ProfileHeader } from '../components/ProfileHeader'
import { StudentInfoSection } from '../components/StudentInfoSection'
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
    const navigate = useNavigate()

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

                {!isLoading && me && <ProfileHeader user={me} group={selectedGroup} />}

                {!isLoading && me && studentError != null && (
                    <div className="mb-5">
                        <EmptyState title={t('student.notFound')} description={t('student.notFoundHint')} />
                    </div>
                )}

                <div className="mb-5">
                    <BalanceCard student={student ?? null} />
                </div>

                <CollapsibleSection title={t('student.groupAttendanceSection')} defaultOpen>
                    <GroupAttendanceSection
                        groups={groups}
                        selectedGroupId={selectedGroupId}
                        selectedGroup={selectedGroup}
                        onSelectGroup={setPickedGroupId}
                        groupsLoading={groupsQuery.isLoading}
                        groupsError={groupsQuery.error}
                        attendanceEntries={attendanceQuery.entries}
                        attendanceLoading={attendanceQuery.isLoading}
                        month={month}
                        onMonthChange={setMonth}
                    />
                </CollapsibleSection>

                <CollapsibleSection title={t('student.infoSection')}>
                    <StudentInfoSection parentPhone={student?.parentPhone} birthDate={me?.birthDate} />
                </CollapsibleSection>

                <CollapsibleSection title={t('student.settingsSection')}>
                    <p className="mb-3 text-sm text-fg-muted">{t('student.settingsHint')}</p>
                    <Button variant="secondary" onClick={() => navigate('/settings')}>
                        {t('nav.settings')}
                    </Button>
                </CollapsibleSection>

                <div className="mt-2 flex justify-center">
                    <Button variant="danger" onClick={signOut}>
                        {t('common.signOut')}
                    </Button>
                </div>
            </div>
        </AppShell>
    )
}
