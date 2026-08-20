import type { BadgeTone } from './Badge'

/** Ranglar semantik tokenlarga bog'langan, shuning uchun dark rejimda ham moslashadi. */
export const badgeToneClasses: Record<BadgeTone, string> = {
    success: 'border-success/15 bg-success-soft text-success-fg',
    danger: 'border-danger/15 bg-danger-soft text-danger-fg',
    warning: 'border-warning-fg/15 bg-warning-soft text-warning-fg',
    neutral: 'border-border-base bg-neutral-soft text-fg-muted',
    accent: 'border-accent/15 bg-accent-soft text-accent-fg',
    purple: 'border-purple/15 bg-purple-soft text-purple-fg',
    amber: 'border-amber/15 bg-amber-soft text-amber-fg',
    sage: 'border-sage-fg/15 bg-sage-soft text-sage-fg',
    steel: 'border-steel/15 bg-steel-soft text-steel-fg',
    slate: 'border-slate-fg/15 bg-slate-soft text-slate-fg',
}
