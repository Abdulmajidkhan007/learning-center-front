import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'

/**
 * "Endpoint hali yo'q" belgisi.
 *
 * Ko'rinish tayyor, ma'lumot esa yo'q joylarda ishlatiladi. Nega kerak:
 * bo'sh blok "buzilgan" deb o'ylanadi, bu esa ataylab shundayligini aytadi
 * va backend uchun ro'yxat bo'lib xizmat qiladi.
 */
export function PendingBackend({ className }: { className?: string }) {
    const { t } = useT()

    return (
        <div
            className={cn(
                'rounded-lg border border-dashed border-border-base bg-surface-muted/40 px-4 py-3',
                className
            )}
        >
            <p className="font-mono text-[0.62rem] tracking-[0.08em] text-fg-faint uppercase">
                {t('pending.title')}
            </p>
            <p className="mt-1 text-sm text-fg-muted">{t('pending.body')}</p>
        </div>
    )
}

/** Kichik variant — karta burchagiga sig'adigan yorliq. */
export function PendingTag() {
    const { t } = useT()
    return (
        <span className="rounded-full bg-surface-muted px-2 py-0.5 font-mono text-[0.58rem] tracking-[0.06em] text-fg-faint uppercase">
            {t('pending.short')}
        </span>
    )
}
