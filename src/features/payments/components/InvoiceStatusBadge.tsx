import { useT } from '@/shared/i18n'
import { Badge, type BadgeTone } from '@/shared/ui'
import type { InvoiceStatus } from '@/shared/types'

const STATUS_TONE: Record<InvoiceStatus, BadgeTone> = {
    PAID: 'success',
    PENDING: 'amber',
    OVERDUE: 'danger',
}

export function InvoiceStatusBadge({ status }: { status?: InvoiceStatus }) {
    const { t } = useT()
    if (!status) return <span className="text-fg-faint">—</span>
    return <Badge tone={STATUS_TONE[status]}>{t(`invoice.status.${status}`)}</Badge>
}
