import { cn } from '@/shared/lib'
import type { WeekDay } from '@/shared/types'

/** Yakshanba yo'q — markaz o'sha kuni ishlamaydi. */
const SELECTABLE_DAYS: WeekDay[] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
]

interface DayPickerProps {
    value: WeekDay[]
    onChange: (days: WeekDay[]) => void
}

export function DayPicker({ value, onChange }: DayPickerProps) {
    function toggle(day: WeekDay) {
        onChange(value.includes(day) ? value.filter((item) => item !== day) : [...value, day])
    }

    return (
        <div className="flex flex-wrap gap-1.5">
            {SELECTABLE_DAYS.map((day) => {
                const isSelected = value.includes(day)
                return (
                    <button
                        key={day}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggle(day)}
                        className={cn(
                            'cursor-pointer rounded-md border px-2.5 py-1.5 font-mono text-xs tracking-[0.03em] uppercase transition-colors',
                            isSelected
                                ? 'border-fg bg-fg text-fg-inverted'
                                : 'border-border-base bg-surface-card text-fg-muted hover:border-border-strong'
                        )}
                    >
                        {day.slice(0, 3)}
                    </button>
                )
            })}
        </div>
    )
}
