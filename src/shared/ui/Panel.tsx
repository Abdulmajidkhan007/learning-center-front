import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** Sahifadagi asosiy oq karta. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <section
            className={cn(
                'rounded-lg border border-border-base bg-surface-card p-6 shadow-[0_10px_30px_-18px_rgba(31,42,61,0.3)]',
                className
            )}
        >
            {children}
        </section>
    )
}
