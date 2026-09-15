import { useT } from '@/shared/i18n'
import { Badge } from '@/shared/ui'
import type { BadgeTone } from '@/shared/ui'
import type { SubscriptionStatus } from '@/shared/types'

/**
 * `GRACE` ataylab sariq: muddat tugagan, lekin kirish hali ochiq —
 * bu "xato" ham, "hammasi joyida" ham emas, oraliq holat.
 */
const TONES: Record<SubscriptionStatus, BadgeTone> = {
    ACTIVE: 'success',
    GRACE: 'amber',
    EXPIRED: 'danger',
    CANCELED: 'neutral',
}

export function SubscriptionStatusBadge({ status }: { status?: SubscriptionStatus }) {
    const { t } = useT()
    if (!status) return null
    return <Badge tone={TONES[status]}>{t(`subscription.status.${status}`)}</Badge>
}
