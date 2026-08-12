import { useT } from '@/shared/i18n'
import { PendingTag } from '@/shared/ui'
import type { TranslationKey } from '@/shared/i18n'

const CELLS: { labelKey: TranslationKey; tone: string }[] = [
    { labelKey: 'teacher.currentUnit', tone: 'text-fg' },
    { labelKey: 'teacher.homeworkDone', tone: 'text-success-fg' },
    { labelKey: 'teacher.homeworkMissing', tone: 'text-danger-fg' },
    { labelKey: 'teacher.groupProgress', tone: 'text-accent-fg' },
]

/**
 * Joriy mavzu, uy vazifasi va guruh progressi.
 *
 * Bu ma'lumotlarning hech biri backendda hali yo'q — blok ko'rinish sifatida
 * turibdi va nima kerakligini aniq ko'rsatadi.
 */
export function LessonStrip() {
    const { t } = useT()

    return (
        <section className="mb-5 rounded-lg border border-border-base bg-surface-card p-1.5">
            <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
                {CELLS.map((cell) => (
                    <div key={cell.labelKey} className="rounded-md bg-surface px-3.5 py-3">
                        <div className="truncate font-mono text-[0.6rem] tracking-[0.05em] text-fg-faint uppercase">
                            {t(cell.labelKey)}
                        </div>
                        <div className={`mt-1 font-display text-lg font-semibold ${cell.tone} opacity-40`}>
                            —
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end px-2 pt-1.5 pb-0.5">
                <PendingTag />
            </div>
        </section>
    )
}
