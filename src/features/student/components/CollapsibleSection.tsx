import { useState, type ReactNode } from 'react'
import { Panel } from '@/shared/ui'
import { cn } from '@/shared/lib'

interface CollapsibleSectionProps {
    title: string
    /** Sahifa ochilganda shu bo'lim ochiq tursinmi. */
    defaultOpen?: boolean
    children: ReactNode
}

/**
 * Ochilib-yopiladigan panel — profil ekranidagi uchta ikkinchi darajali
 * bo'lim (guruh, ma'lumotlar, sozlamalar) shu bilan yig'iladi.
 *
 * `<details>` o'rniga oddiy tugma: ochiq/yopiqligini `aria-expanded` orqali
 * aniq bildiradi va `getByRole('button')` bilan tekshirish oson bo'ladi.
 */
export function CollapsibleSection({ title, defaultOpen = false, children }: CollapsibleSectionProps) {
    const [open, setOpen] = useState(defaultOpen)

    return (
        <Panel className="mb-5">
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
            >
                <span className="font-display text-lg font-semibold text-fg">{title}</span>
                <span
                    aria-hidden="true"
                    className={cn('text-fg-faint transition-transform', open && 'rotate-180')}
                >
                    ▾
                </span>
            </button>

            {open && <div className="mt-4">{children}</div>}
        </Panel>
    )
}
