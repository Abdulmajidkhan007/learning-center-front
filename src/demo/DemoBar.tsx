import type { DemoRole } from './roles'
import { DEMO_ROLES } from './roles'

interface DemoBarProps {
    role: DemoRole
    onRoleChange: (role: DemoRole) => void
}

/**
 * Demo uchun suzuvchi panel: rolni almashtirib, har bir dashboardni
 * ko'rish mumkin. Production bundle'ga tushmaydi.
 */
export function DemoBar({ role, onRoleChange }: DemoBarProps) {
    return (
        <div className="fixed bottom-4 left-1/2 z-100 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center gap-2 rounded-full border border-border-base bg-surface-card/95 px-3 py-2 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.4)] backdrop-blur">
            <span className="pl-1.5 font-mono text-[0.62rem] tracking-[0.08em] text-fg-faint uppercase">
                Demo · mock data
            </span>
            {DEMO_ROLES.map((item) => (
                <button
                    key={item.value}
                    type="button"
                    onClick={() => onRoleChange(item.value)}
                    className={
                        'cursor-pointer rounded-full px-3 py-1 text-xs transition-colors ' +
                        (item.value === role
                            ? 'bg-fg font-semibold text-fg-inverted'
                            : 'text-fg-muted hover:bg-surface-hover')
                    }
                >
                    {item.label}
                </button>
            ))}
        </div>
    )
}
