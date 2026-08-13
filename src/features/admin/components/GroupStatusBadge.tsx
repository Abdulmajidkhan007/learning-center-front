import { useT } from '@/shared/i18n'
import { Badge, type BadgeTone } from '@/shared/ui'
import type { GroupStatus } from '@/shared/types'

const STATUS_TONE: Record<GroupStatus, BadgeTone> = {
    STARTING: 'amber',
    ONGOING: 'sage',
    ENDED: 'slate',
}

export function GroupStatusBadge({ status }: { status?: GroupStatus }) {
    const { t } = useT()
    if (!status) return <span className="text-fg-faint">—</span>
    return <Badge tone={STATUS_TONE[status]}>{t(`status.${status}`)}</Badge>
}
