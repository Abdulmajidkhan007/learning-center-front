import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** Sahifadagi asosiy oq karta. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <section
            className={cn(
                'rounded-xl border border-border-base bg-surface-card/78 p-6 shadow-[0_24px_70px_-38px_var(--fg)] backdrop-blur-xl',
                className
            )}
        >
            {children}
        </section>
    )
}
