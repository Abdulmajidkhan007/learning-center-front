import { useT } from '@/shared/i18n'
import { cn, formatTime } from '@/shared/lib'
import type { GroupDto } from '@/shared/types'

interface GroupTabsProps {
    groups: GroupDto[]
    selectedId: string
    onSelect: (groupId: string) => void
}

/**
 * Guruhlar tasmasi.
 *
 * Ochiladigan ro'yxat (dropdown) o'rniga tab'lar: o'qituvchida odatda 2–6 ta
 * guruh bo'ladi va ularni bir qarashda ko'rish, bir bosishda almashtirish
 * qulayroq. Tor ekranda tasma gorizontal siljiydi.
 */
export function GroupTabs({ groups, selectedId, onSelect }: GroupTabsProps) {
    const { t } = useT()

    if (groups.length === 0) return null

    return (
        <div
            role="tablist"
            aria-label={t('teacher.switchGroup')}
            className="mb-5 flex gap-2 overflow-x-auto rounded-lg border border-border-base bg-surface-card p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            {groups.map((group) => {
                const isActive = group.id === selectedId
                return (
                    <button
                        key={group.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onSelect(group.id)}
                        className={cn(
                            'shrink-0 cursor-pointer rounded-md px-4 py-2 text-left transition-colors',
                            isActive ? 'bg-purple-soft' : 'hover:bg-surface-hover'
                        )}
                    >
                        <span
                            className={cn(
                                'block text-sm font-semibold whitespace-nowrap',
                                isActive ? 'text-purple-fg' : 'text-fg'
                            )}
                        >
                            {group.name}
                        </span>
                        <span className="block font-mono text-[0.65rem] whitespace-nowrap text-fg-faint tabular-nums">
                            {formatTime(group.timeTable?.startTime) || '—'}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
