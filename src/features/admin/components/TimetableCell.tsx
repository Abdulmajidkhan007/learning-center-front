import { useT } from '@/shared/i18n'
import { formatTime } from '@/shared/lib'
import type { TimeTableDto } from '@/shared/types'

/** Kunlar chapda ustun bo'lib, vaqt o'ng tomonda — jadval kengaymasin. */
export function TimetableCell({ timeTable }: { timeTable?: TimeTableDto }) {
    const { t } = useT()

    if (!timeTable) return <span className="text-fg-faint">—</span>

    const days = timeTable.days ?? []
    const start = formatTime(timeTable.startTime)
    const end = formatTime(timeTable.endTime)

    return (
        <div className="flex items-start gap-3 whitespace-normal">
            {days.length > 0 && (
                <div className="flex flex-col gap-0.5">
                    {days.map((day) => (
                        <span
                            key={day}
                            className="w-fit rounded-full bg-steel-soft px-1.5 py-px font-mono text-[0.63rem] font-medium text-steel-fg"
                        >
                            {t(`day.${day}`)}
                        </span>
                    ))}
                </div>
            )}
            {(start || end) && (
                <div className="flex flex-col gap-0.5 border-l-2 border-border-base pl-2.5">
                    {start && <span className="font-mono text-xs font-semibold text-fg">{start}</span>}
                    {end && <span className="font-mono text-xs text-fg-muted">{end}</span>}
                </div>
            )}
        </div>
    )
}
