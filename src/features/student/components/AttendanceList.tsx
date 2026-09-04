import { useT } from '@/shared/i18n'
import { Badge, SegmentedControl } from '@/shared/ui'
import { formatDate } from '@/shared/lib'
import { STATUS_TONE } from '@/shared/lib/attendanceStatus'
import type { MyAttendanceDto } from '@/shared/types'

export type MonthOption = '1' | '2' | '3'

interface AttendanceListProps {
    entries: MyAttendanceDto[]
    isLoading: boolean
    month: MonthOption
    onMonthChange: (month: MonthOption) => void
}

/**
 * O'quvchining o'z davomati — oy tanlagich, xulosa qatori va ro'yxat.
 *
 * Xulosa mijozda hisoblanadi: backend faqat yozuvlar ro'yxatini beradi,
 * "necha darsdan nechtasida qatnashdi" degan son alohida endpoint emas.
 */
export function AttendanceList({ entries, isLoading, month, onMonthChange }: AttendanceListProps) {
    const { t } = useT()

    const attendedCount = entries.filter((entry) => entry.status === 'PRESENT').length

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-fg">
                    {t('student.attendanceSummary', { attended: attendedCount, total: entries.length })}
                </p>
                <SegmentedControl<MonthOption>
                    label={t('attendance.monthFilter')}
                    value={month}
                    onChange={onMonthChange}
                    options={[
                        { value: '1', label: t('attendance.monthCurrent') },
                        { value: '2', label: t('attendance.monthPrevious') },
                        { value: '3', label: t('attendance.monthTwoAgo') },
                    ]}
                />
            </div>

            {isLoading && <p className="font-mono text-sm text-fg-faint py-4 text-center">{t('common.loading')}</p>}

            {!isLoading && entries.length === 0 && (
                <div className="py-2">
                    <p className="text-center font-mono text-sm text-fg-faint">{t('student.noAttendance')}</p>
                </div>
            )}

            {!isLoading && entries.length > 0 && (
                <ul className="divide-y divide-border-base">
                    {entries.map((entry, index) => (
                        <li key={index} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                            <div className="min-w-0">
                                <p className="truncate font-display font-medium text-fg">{entry.title || '—'}</p>
                                <p className="font-mono text-[0.62rem] text-fg-faint">{formatDate(entry.date)}</p>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                                {entry.reason && (
                                    <span className="max-w-40 truncate text-xs text-fg-muted" title={entry.reason}>
                                        {entry.reason}
                                    </span>
                                )}
                                <Badge tone={STATUS_TONE[entry.status]}>{t(`attendance.${entry.status}`)}</Badge>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
