import { Badge, type BadgeTone } from '@/shared/ui'
import { titleCase } from '@/shared/lib'
import type { GroupStatus } from '@/shared/types'

const STATUS_TONE: Record<GroupStatus, BadgeTone> = {
    STARTING: 'amber',
    ONGOING: 'sage',
    ENDED: 'slate',
}

export function GroupStatusBadge({ status }: { status?: GroupStatus }) {
    if (!status) return <span className="text-fg-faint">—</span>
    return <Badge tone={STATUS_TONE[status]}>{titleCase(status)}</Badge>
}
