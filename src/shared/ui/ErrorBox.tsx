import type { ReactNode } from 'react'

/** Xato xabari uchun yagona ko'rinish — `role="alert"` skrinriderlar uchun. */
export function ErrorBox({ children }: { children: ReactNode }) {
    return (
        <div role="alert" className="rounded-md bg-danger-soft px-4 py-3 text-sm text-danger-fg">
            {children}
        </div>
    )
}
