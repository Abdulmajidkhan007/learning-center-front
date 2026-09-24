import type { BadgeTone } from './Badge'

/** Ranglar semantik tokenlarga bog'langan, shuning uchun dark rejimda ham moslashadi. */
export const badgeToneClasses: Record<BadgeTone, string> = {
    success: 'border-success/30 bg-success-soft text-success-fg dark:border-success/40 dark:bg-success-soft/80 dark:text-success-fg',
    danger: 'border-danger/30 bg-danger-soft text-danger-fg dark:border-danger/40 dark:bg-danger-soft/80 dark:text-danger-fg',
    warning: 'border-warning-fg/30 bg-warning-soft text-warning-fg dark:border-warning-fg/40 dark:bg-warning-soft/80 dark:text-warning-fg',
    neutral: 'border-border-base bg-neutral-soft text-fg-muted dark:border-border-strong dark:bg-neutral-soft/80 dark:text-fg-muted',
    accent: 'border-accent/30 bg-accent-soft text-accent-fg dark:border-accent/40 dark:bg-accent-soft/80 dark:text-accent-fg',
    purple: 'border-purple/30 bg-purple-soft text-purple-fg dark:border-purple/40 dark:bg-purple-soft/80 dark:text-purple-fg',
    amber: 'border-amber/30 bg-amber-soft text-amber-fg dark:border-amber/40 dark:bg-amber-soft/80 dark:text-amber-fg',
    sage: 'border-sage-fg/30 bg-sage-soft text-sage-fg dark:border-sage-fg/40 dark:bg-sage-soft/80 dark:text-sage-fg',
    steel: 'border-steel/30 bg-steel-soft text-steel-fg dark:border-steel/40 dark:bg-steel-soft/80 dark:text-steel-fg',
    slate: 'border-slate-fg/30 bg-slate-soft text-slate-fg dark:border-slate-fg/40 dark:bg-slate-soft/80 dark:text-slate-fg',
}
