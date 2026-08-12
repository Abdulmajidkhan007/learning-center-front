import type { ReactNode } from 'react'
import { Brand } from './Brand'
import { Button } from './Button'
import { ThemeToggle } from './ThemeToggle'

interface DashboardShellProps {
    subtitle: string
    onSignOut: () => void
    /** Sarlavha o'ng tomonidagi qo'shimcha tugmalar. */
    actions?: ReactNode
    children: ReactNode
}

/** Barcha dashboard'lar uchun umumiy sarlavha + sahifa karkasi. */
export function DashboardShell({ subtitle, onSignOut, actions, children }: DashboardShellProps) {
    return (
        <div className="min-h-screen bg-surface">
            <header className="border-b border-border-base bg-surface-card px-6 py-3.5 sm:px-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Brand subtitle={subtitle} />
                    <div className="flex flex-wrap items-center gap-2.5">
                        {actions}
                        <ThemeToggle />
                        <Button size="sm" onClick={onSignOut}>
                            Sign out
                        </Button>
                    </div>
                </div>
            </header>
            <main className="px-6 py-8 pb-16 sm:px-10">{children}</main>
        </div>
    )
}
