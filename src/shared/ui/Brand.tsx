import { cn } from '@/shared/lib'

/** "CLC · Cornerstone …" logotipi. `subtitle` — sahifa nomi. */
export function Brand({ subtitle, className }: { subtitle?: string; className?: string }) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <span className="rounded-sm bg-brand px-1.5 py-0.5 font-mono text-xs tracking-[0.1em] text-brand-fg">
                CLC
            </span>
            {subtitle && <span className="font-mono text-[0.78rem] text-fg-muted">{subtitle}</span>}
        </div>
    )
}
