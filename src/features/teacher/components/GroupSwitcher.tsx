import { useRef, useState } from 'react'
import { useClickOutside } from '@/shared/hooks/useClickOutside'
import { cn } from '@/shared/lib'
import type { GroupDto } from '@/shared/types'

interface GroupSwitcherProps {
    groups: GroupDto[]
    selectedId: string
    onSelect: (groupId: string) => void
}

/**
 * Guruh almashtirgich.
 *
 * Ataylab HOVER emas, BOSISH bilan ochiladi: hover menyular kursorni
 * noto'g'ri burchakda harakatlantirganda yopilib qoladi va bosib ulgurmaysiz.
 */
export function GroupSwitcher({ groups, selectedId, onSelect }: GroupSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useClickOutside(containerRef, () => setIsOpen(false), isOpen)

    const selected = groups.find((group) => group.id === selectedId)

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onClick={() => setIsOpen((open) => !open)}
                className="inline-flex cursor-pointer items-center font-display text-lg font-semibold text-purple-fg"
            >
                {selected?.name ?? 'Select group'}
                <span className="ml-1 text-xs">{isOpen ? '▴' : '▾'}</span>
            </button>

            {isOpen && (
                <div
                    role="menu"
                    className="absolute top-full left-0 z-20 mt-2 min-w-44 rounded-lg border border-purple/30 bg-surface-card p-1.5 shadow-[0_16px_40px_-14px_rgba(0,0,0,0.35)]"
                >
                    <div className="px-2.5 pt-1 pb-1.5 font-mono text-[0.62rem] tracking-[0.06em] text-fg-faint uppercase">
                        Switch group
                    </div>
                    {groups.map((group) => {
                        const isActive = group.id === selectedId
                        return (
                            <button
                                key={group.id}
                                role="menuitem"
                                type="button"
                                onClick={() => {
                                    onSelect(group.id)
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    'flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors',
                                    isActive
                                        ? 'bg-purple-soft font-semibold text-purple-fg'
                                        : 'text-fg hover:bg-surface-hover'
                                )}
                            >
                                <span className="w-3.5 shrink-0 text-xs text-purple-fg">{isActive ? '✓' : ''}</span>
                                {group.name}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
