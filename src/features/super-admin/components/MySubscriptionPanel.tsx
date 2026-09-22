import { useT } from '@/shared/i18n'
import { formatAmount, formatDate } from '@/shared/lib'
import { Eyebrow, Panel, SubscriptionStatusBadge } from '@/shared/ui'
import { daysLeft } from '../lib/daysLeft'
import type { SubscriptionDto } from '@/shared/types'

/** Shu kundan kam qolganda ogohlantirish ko'rinadi. */
const WARN_DAYS = 7

export function MySubscriptionPanel({
    subscription,
    isLoading,
}: {
    subscription: SubscriptionDto | null
    isLoading: boolean
}) {
    const { t } = useT()

    if (isLoading) return null

    // Obuna umuman yo'q — yangi markazda shunday bo'ladi va bu xato emas.
    // Bo'sh panel chizishdan ko'ra hech nima ko'rsatmagan ma'qul: markaz
    // egasi buni dasturchi bilan hal qiladi, ekrandan emas.
    if (!subscription) return null

    const remaining = daysLeft(subscription.expiresAt)
    const isExpired = remaining !== null && remaining < 0
    const isEnding = remaining !== null && remaining >= 0 && remaining <= WARN_DAYS

    return (
        <Panel className="mb-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <Eyebrow>{t('subscription.mine')}</Eyebrow>
                    <p className="mt-1 font-display text-lg font-semibold text-fg">
                        {subscription.plan?.name ?? '—'}
                    </p>
                </div>
                <SubscriptionStatusBadge status={subscription.status} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div>
                    <dt className="text-xs text-fg-muted">{t('subscription.expiresAt')}</dt>
                    <dd className="mt-0.5 font-medium text-fg">
                        {formatDate(subscription.expiresAt) || '—'}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-fg-muted">{t('subscription.daysLeft')}</dt>
                    <dd
                        className={
                            isExpired || isEnding
                                ? 'mt-0.5 font-semibold tabular-nums text-danger-fg'
                                : 'mt-0.5 font-medium tabular-nums text-fg'
                        }
                    >
                        {remaining === null ? '—' : Math.max(remaining, 0)}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs text-fg-muted">{t('subscription.paidAmount')}</dt>
                    <dd className="mt-0.5 font-medium tabular-nums text-fg">
                        {formatAmount(subscription.paidAmount)}
                    </dd>
                </div>
            </dl>

            {/* Ogohlantirish faqat haqiqatan kerak bo'lganda chiqadi: doim
                turgan xabarni odam bir haftada ko'rmay qo'yadi. */}
            {(isExpired || isEnding) && (
                <p className="mt-3 rounded-lg border border-danger/15 bg-danger-soft px-3 py-2 text-sm text-danger-fg">
                    {isExpired ? t('subscription.expiredWarning') : t('subscription.endingWarning')}
                </p>
            )}
        </Panel>
    )
}
