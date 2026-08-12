import { cn } from '@/shared/lib'
import { ENTITIES, ENTITY_ACCENT } from '../config/entities'
import type { EntityKey } from '../types'

/**
 * `null` — sonini o'qib bo'lmadi ("—"), `undefined` — hali yuklanmoqda ("···").
 * Ikkalasini ajratish muhim: nol emas, xato ekanini ko'rsatish kerak.
 */
export function StatsRow({ counts }: { counts: Record<EntityKey, number | null | undefined> }) {
    return (
        <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {ENTITIES.map((entity) => (
                <div
                    key={entity.key}
                    className={cn(
                        'rounded-lg border border-t-3 border-border-base bg-surface-card px-4.5 py-5',
                        'shadow-[0_6px_16px_-10px_rgba(31,42,61,0.25)] transition-transform hover:-translate-y-0.5',
                        ENTITY_ACCENT[entity.key]
                    )}
                >
                    <div className="mb-1.5 font-mono text-[0.68rem] tracking-[0.06em] text-fg-faint uppercase">
                        {entity.label}
                    </div>
                    <div className="font-display text-3xl font-semibold text-fg">
                        {counts[entity.key] === null ? '—' : (counts[entity.key] ?? '···')}
                    </div>
                </div>
            ))}
        </div>
    )
}
