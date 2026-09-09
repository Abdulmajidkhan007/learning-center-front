import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { EmptyState, ErrorBox } from '@/shared/ui'
import type { GroupDto, MyAttendanceDto } from '@/shared/types'
import { AttendanceList, type MonthOption } from './AttendanceList'
import { GroupCard } from './GroupCard'
import { GroupPicker } from './GroupPicker'

interface GroupAttendanceSectionProps {
    groups: GroupDto[]
    selectedGroupId: string
    selectedGroup?: GroupDto
    onSelectGroup: (groupId: string) => void
    groupsLoading: boolean
    groupsError: unknown
    attendanceEntries: MyAttendanceDto[]
    attendanceLoading: boolean
    month: MonthOption
    onMonthChange: (month: MonthOption) => void
}

/** "Guruhim va davomat" bo'limi — guruh tanlagich, guruh kartasi va davomat ro'yxati. */
export function GroupAttendanceSection({
    groups,
    selectedGroupId,
    selectedGroup,
    onSelectGroup,
    groupsLoading,
    groupsError,
    attendanceEntries,
    attendanceLoading,
    month,
    onMonthChange,
}: GroupAttendanceSectionProps) {
    const { t } = useT()

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-fg-muted">{t('student.groupHint')}</p>
                <GroupPicker groups={groups} selectedId={selectedGroupId} onSelect={onSelectGroup} />
            </div>

            {groupsLoading && (
                <p className="py-4 text-center font-mono text-sm text-fg-faint">{t('common.loading')}</p>
            )}

            {groupsError != null && <ErrorBox>{errorMessage(groupsError)}</ErrorBox>}

            {!groupsLoading && groupsError == null && selectedGroup && <GroupCard group={selectedGroup} />}

            {!groupsLoading && groupsError == null && !selectedGroup && (
                <EmptyState title={t('student.noGroups')} description={t('student.noGroupsHint')} />
            )}

            <div className="mt-5 border-t border-border-base pt-5">
                {selectedGroup ? (
                    <AttendanceList
                        entries={attendanceEntries}
                        isLoading={attendanceLoading}
                        month={month}
                        onMonthChange={onMonthChange}
                    />
                ) : (
                    <EmptyState title={t('student.noGroups')} />
                )}
            </div>
        </div>
    )
}
