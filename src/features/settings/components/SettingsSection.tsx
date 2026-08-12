import type { ReactNode } from 'react'
import { Eyebrow, Panel } from '@/shared/ui'

interface SettingsSectionProps {
    title: string
    description: string
    /** Sarlavha yonidagi belgi — masalan "endpoint yo'q". */
    tag?: ReactNode
    children: ReactNode
}

/** Sozlamalar sahifasidagi bitta blok — hammasi bir xil ko'rinishda. */
export function SettingsSection({ title, description, tag, children }: SettingsSectionProps) {
    return (
        <Panel className="mb-5">
            <header className="mb-4 flex flex-wrap items-center gap-2">
                <div className="min-w-0 flex-1">
                    <Eyebrow>{title}</Eyebrow>
                    <p className="mt-1 text-sm text-fg-muted">{description}</p>
                </div>
                {tag}
            </header>
            {children}
        </Panel>
    )
}
