import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'

/** Blok ustidagi kichik monospace yozuv ("RECORDS", "NEW LESSON"). */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <span className={cn('block font-mono text-[0.7rem] tracking-[0.08em] text-fg-faint uppercase', className)}>
            {children}
        </span>
    )
}
