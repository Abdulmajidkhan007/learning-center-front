import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { ENTITIES, ENTITY_ACCENT } from '../config/entities'
import type { EntityKey } from '../types'

/**
 * `null` — sonini o'qib bo'lmadi ("—"), `undefined` — hali yuklanmoqda ("···").
 * Ikkalasini ajratish muhim: nol emas, xato ekanini ko'rsatish kerak.
 */
export function StatsRow({ counts }: { counts: Record<EntityKey, number | null | undefined> }) {
    const { t } = useT()

    return (
        <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {ENTITIES.map((entity) => (
                <div
                    key={entity.key}
                    className={cn(
                        'rounded-lg border border-t-3 border-border-base bg-surface-card px-4 py-4',
                        'shadow-[0_6px_16px_-10px_rgba(31,42,61,0.25)] transition-transform hover:-translate-y-0.5',
                        ENTITY_ACCENT[entity.key]
                    )}
                >
                    <div className="mb-1 truncate font-mono text-[0.62rem] tracking-[0.06em] text-fg-faint uppercase">
                        {t(entity.pluralKey)}
                    </div>
                    <div className="font-display text-2xl font-semibold tabular-nums text-fg sm:text-3xl">
                        {counts[entity.key] === null ? '—' : (counts[entity.key] ?? '···')}
                    </div>
                </div>
            ))}
        </div>
    )
}
