import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { badgeToneClasses } from './badgeClasses'

export type BadgeTone = 'success' | 'danger' | 'warning' | 'neutral' | 'accent' | 'purple' | 'amber' | 'sage' | 'steel' | 'slate'

export function Badge({
    tone = 'neutral',
    className,
    children,
}: {
    tone?: BadgeTone
    className?: string
    children: ReactNode
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shadow-[0_10px_24px_-24px_var(--fg)]',
                badgeToneClasses[tone],
                className
            )}
        >
            {children}
        </span>
    )
}

/** Davomat jadvalidagi dumaloq bitta harfli nishon. */
export function DotBadge({
    tone = 'neutral',
    title,
    children,
}: {
    tone?: BadgeTone
    /** Sichqoncha ustiga borganda ko'rinadigan matn — masalan, sababli bo'lish izohi. */
    title?: string
    children: ReactNode
}) {
    return (
        <span
            title={title}
            className={cn(
                'inline-flex size-7.5 items-center justify-center rounded-full border font-mono text-sm font-bold shadow-[0_10px_24px_-24px_var(--fg)]',
                badgeToneClasses[tone]
            )}
        >
            {children}
        </span>
    )
}
