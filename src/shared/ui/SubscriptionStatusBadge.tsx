import { useT } from '@/shared/i18n'
import { Badge } from './Badge'
import { subscriptionStatusTones } from './subscriptionStatusTones'
import type { SubscriptionStatus } from '@/shared/types'

export function SubscriptionStatusBadge({ status }: { status?: SubscriptionStatus }) {
    const { t } = useT()
    if (!status) return null
    return <Badge tone={subscriptionStatusTones[status]}>{t(`subscription.status.${status}`)}</Badge>
}
