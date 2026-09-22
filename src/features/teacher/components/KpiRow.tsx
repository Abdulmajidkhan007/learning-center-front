import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { PendingTag } from '@/shared/ui'
import type { TranslationKey } from '@/shared/i18n'
import type { GroupStatsDto } from '@/shared/types'

interface Kpi {
    labelKey: TranslationKey
    /** Karta ustidagi rangli chiziq — holatning og'irligini bildiradi. */
    accent: string
    value: (stats: GroupStatsDto) => number | undefined
}

const KPIS: Kpi[] = [
    { labelKey: 'kpi.total', accent: 'border-t-steel', value: (s) => s.totalStudents },
    { labelKey: 'kpi.active', accent: 'border-t-success', value: (s) => s.activeStudents },
    { labelKey: 'kpi.new', accent: 'border-t-accent', value: (s) => s.newStudents },
    { labelKey: 'kpi.lost', accent: 'border-t-slate-fg', value: (s) => s.lostStudents },
    {
        labelKey: 'kpi.potentialFail',
        accent: 'border-t-amber',
        value: (s) => s.potentialFailStudents,
    },
]

/**
 * Qizil va qora ro'yxat ALOHIDA turadi, chunki ular hali hisoblanmaydi:
 * backend so'rovida ikkalasi ham `CAST(0 AS BIGINT)`. Birinchisi uy
 * vazifasi imkoniyatini, ikkinchisi bloklangan o'quvchi statusini kutyapti.
 *
 * Ularni qolganlari bilan birga "0" qilib ko'rsatish yaramaydi: o'qituvchi
 * "muammoli o'quvchi yo'q" deb tushunadi, holbuki hech kim sanamagan.
 * Shuning uchun raqam o'rnida "—" va "endpoint yo'q" belgisi turadi.
 */
const PENDING_KPIS: { labelKey: TranslationKey; accent: string }[] = [
    { labelKey: 'kpi.redList', accent: 'border-t-danger' },
    { labelKey: 'kpi.blackList', accent: 'border-t-fg' },
]

function KpiCard({
    label,
    accent,
    value,
}: {
    label: string
    accent: string
    value: number | undefined
}) {
    return (
        <div
            className={cn(
                'rounded-lg border border-t-3 border-border-base bg-surface-card px-3 py-3',
                accent
            )}
        >
            <div className="truncate font-mono text-[0.6rem] tracking-[0.05em] text-fg-faint uppercase">
                {label}
            </div>
            <div
                className={cn(
                    'mt-1 font-display text-xl font-semibold tabular-nums',
                    value === undefined ? 'text-fg-faint' : 'text-fg'
                )}
            >
                {value ?? '—'}
            </div>
        </div>
    )
}

/**
 * O'qituvchi ko'rsatkichlari — uning BARCHA guruhlari bo'yicha birga.
 *
 * Backend `groupId` qabul qilmaydi, shuning uchun bu pastdagi tanlangan
 * guruhga emas, umumiy manzaraga tegishli. Sarlavha shuni aytib turadi,
 * aks holda o'qituvchi raqamlarni tanlangan guruhniki deb o'ylaydi.
 */
export function KpiRow({ stats }: { stats: GroupStatsDto | null }) {
    const { t } = useT()

    return (
        <section className="mb-5">
            <div className="mb-2 flex items-center justify-between gap-3">
                <p className="font-mono text-[0.6rem] tracking-[0.05em] text-fg-faint uppercase">
                    {t('kpi.allGroups')}
                </p>
                <PendingTag />
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 xl:grid-cols-7">
                {KPIS.map((kpi) => (
                    <KpiCard
                        key={kpi.labelKey}
                        label={t(kpi.labelKey)}
                        accent={kpi.accent}
                        value={stats ? kpi.value(stats) : undefined}
                    />
                ))}
                {PENDING_KPIS.map((kpi) => (
                    <KpiCard
                        key={kpi.labelKey}
                        label={t(kpi.labelKey)}
                        accent={kpi.accent}
                        value={undefined}
                    />
                ))}
            </div>
        </section>
    )
}
