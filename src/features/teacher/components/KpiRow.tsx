import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PendingTag } from '@/shared/ui'
import type { TranslationKey } from '@/shared/i18n'

interface Kpi {
    labelKey: TranslationKey
    /** Karta ustidagi rangli chiziq — holatning og'irligini bildiradi. */
    accent: string
}

const KPIS: Kpi[] = [
    { labelKey: 'kpi.active', accent: 'border-t-success' },
    { labelKey: 'kpi.new', accent: 'border-t-accent' },
    { labelKey: 'kpi.lost', accent: 'border-t-slate-fg' },
    { labelKey: 'kpi.potentialFail', accent: 'border-t-amber' },
    { labelKey: 'kpi.absent', accent: 'border-t-steel' },
    { labelKey: 'kpi.redList', accent: 'border-t-danger' },
    { labelKey: 'kpi.blackList', accent: 'border-t-fg' },
]

/**
 * Guruh holati bo'yicha ko'rsatkichlar.
 *
 * Backendda bu ko'rsatkichlarni beradigan endpoint hali yo'q, shuning uchun
 * qiymat o'rnida "—" turadi va yonida "endpoint yo'q" belgisi ko'rinadi.
 * Blok ataylab chizilgan: bu backend uchun aniq ro'yxat bo'lib xizmat qiladi.
 */
export function KpiRow() {
    const { t } = useT()

    return (
        <section className="mb-5">
            <div className="mb-2 flex items-center justify-end">
                <PendingTag />
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-7">
                {KPIS.map((kpi) => (
                    <div
                        key={kpi.labelKey}
                        className={cn(
                            'rounded-lg border border-t-3 border-border-base bg-surface-card px-3 py-3',
                            kpi.accent
                        )}
                    >
                        <div className="truncate font-mono text-[0.6rem] tracking-[0.05em] text-fg-faint uppercase">
                            {t(kpi.labelKey)}
                        </div>
                        <div className="mt-1 font-display text-xl font-semibold tabular-nums text-fg-faint">
                            —
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
