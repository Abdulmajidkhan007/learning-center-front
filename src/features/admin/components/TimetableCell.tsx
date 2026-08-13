import { useT } from '@/shared/i18n'
import { formatTime } from '@/shared/lib'
import { Badge } from '@/shared/ui'
import type { TimeTableDto } from '@/shared/types'

/**
 * Jadval katagi: kun turi (toq/juft) va vaqt oralig'i.
 *
 * Backend alohida kunlar ro'yxatini saqlamaydi — faqat `dayType`.
 */
export function TimetableCell({ timeTable }: { timeTable?: TimeTableDto }) {
    const { t } = useT()

    if (!timeTable) return <span className="text-fg-faint">—</span>

    const start = formatTime(timeTable.startTime)
    const end = formatTime(timeTable.endTime)

    return (
        <div className="flex items-center gap-2.5 whitespace-nowrap">
            {timeTable.dayType && (
                <Badge tone="steel">{t(`group.dayType.${timeTable.dayType}`)}</Badge>
            )}
            {(start || end) && (
                <span className="font-mono text-xs tabular-nums text-fg-muted">
                    {start}–{end}
                </span>
            )}
        </div>
    )
}
