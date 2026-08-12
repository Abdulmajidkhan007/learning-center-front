import { Badge, Button } from '@/shared/ui'
import { titleCase } from '@/shared/lib'
import { STATUS_TONE } from '../lib/attendanceStatus'
import type { AttendanceStatus } from '@/shared/types'

interface DraftBarProps {
    counts: Record<AttendanceStatus, number>
    statuses: readonly AttendanceStatus[]
    isSubmitting: boolean
    onFinish: () => void
}

/** Qoralama xulosasi + "Finish" tugmasi. Nol bo'lgan statuslar ko'rsatilmaydi. */
export function DraftBar({ counts, statuses, isSubmitting, onFinish }: DraftBarProps) {
    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-brand/40 bg-surface-card px-5 py-3.5">
            <div className="flex flex-wrap items-center gap-2">
                {statuses.map((status) =>
                    counts[status] > 0 ? (
                        <Badge key={status} tone={STATUS_TONE[status]}>
                            {titleCase(status)}: {counts[status]}
                        </Badge>
                    ) : null
                )}
            </div>
            <Button variant="success" size="sm" onClick={onFinish} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting…' : 'Finish Attendance'}
            </Button>
        </div>
    )
}
