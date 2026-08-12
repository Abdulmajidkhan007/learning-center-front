import { cn } from '@/shared/lib'
import { ENTITIES } from '../config/entities'
import type { EntityKey } from '../types'

interface AdminSidebarProps {
    activeTab: EntityKey
    onTabChange: (tab: EntityKey) => void
    onSignOut: () => void
}

export function AdminSidebar({ activeTab, onTabChange, onSignOut }: AdminSidebarProps) {
    return (
        <aside className="flex w-55 shrink-0 flex-col bg-sidebar py-6 text-sidebar-fg">
            <div className="mb-3 flex items-center gap-2 border-b border-white/10 px-5 pb-6">
                <span className="rounded-sm bg-brand px-1.5 py-0.5 font-mono text-xs tracking-[0.1em] text-brand-fg">
                    CLC
                </span>
                <span className="font-display text-base font-semibold">Cornerstone</span>
            </div>

            <nav className="flex flex-1 flex-col">
                {ENTITIES.map((entity) => (
                    <button
                        key={entity.key}
                        type="button"
                        onClick={() => onTabChange(entity.key)}
                        className={cn(
                            'cursor-pointer border-l-3 px-5 py-3 text-left text-sm transition-colors',
                            activeTab === entity.key
                                ? 'border-l-brand bg-white/6 font-medium text-sidebar-fg'
                                : 'border-l-transparent text-sidebar-fg/65 hover:bg-white/5 hover:text-sidebar-fg'
                        )}
                    >
                        {entity.label}
                    </button>
                ))}
            </nav>

            <div className="border-t border-white/10 px-5 pt-4">
                <div className="mb-2.5 font-mono text-[0.68rem] tracking-[0.06em] text-sidebar-fg/45 uppercase">
                    Administrator
                </div>
                <button
                    type="button"
                    onClick={onSignOut}
                    className="w-full cursor-pointer rounded-md border border-white/25 px-3 py-2 text-xs transition-colors hover:bg-white/10"
                >
                    Sign out
                </button>
            </div>
        </aside>
    )
}
