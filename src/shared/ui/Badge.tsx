import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

export type BadgeTone = 'success' | 'danger' | 'warning' | 'neutral' | 'accent' | 'purple' | 'amber' | 'sage' | 'steel' | 'slate'

const TONE_CLASSES: Record<BadgeTone, string> = {
    success: 'bg-success-soft text-success-fg',
    danger: 'bg-danger-soft text-danger-fg',
    warning: 'bg-warning-soft text-warning-fg',
    neutral: 'bg-neutral-soft text-fg-muted',
    accent: 'bg-accent-soft text-accent-fg',
    purple: 'bg-purple-soft text-purple-fg',
    amber: 'bg-amber-soft text-amber-fg',
    sage: 'bg-sage-soft text-sage-fg',
    steel: 'bg-steel-soft text-steel-fg',
    slate: 'bg-slate-soft text-slate-fg',
}

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
                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                TONE_CLASSES[tone],
                className
            )}
        >
            {children}
        </span>
    )
}

/** Davomat jadvalidagi dumaloq bitta harfli nishon. */
export function DotBadge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
    return (
        <span
            className={cn(
                'inline-flex size-7.5 items-center justify-center rounded-full font-mono text-sm font-bold',
                TONE_CLASSES[tone]
            )}
        >
            {children}
        </span>
    )
}
