import { useT } from '@/shared/i18n'
import { Badge, type BadgeTone } from '@/shared/ui'
import type { LeadStatus } from '@/shared/types'

const STATUS_TONE: Record<LeadStatus, BadgeTone> = {
    NEW: 'accent',
    CONFIRMED: 'success',
    REJECTED: 'danger',
    CALL_LATER: 'amber',
}

export function LeadStatusBadge({ status }: { status?: LeadStatus }) {
    const { t } = useT()
    if (!status) return <span className="text-fg-faint">—</span>
    return <Badge tone={STATUS_TONE[status]}>{t(`lead.status.${status}`)}</Badge>
}
