import { useT } from '@/shared/i18n'
import { Badge, Button } from '@/shared/ui'
import { STATUS_TONE } from '../lib/attendanceStatus'
import type { AttendanceStatus } from '@/shared/types'

interface DraftBarProps {
    counts: Record<AttendanceStatus, number>
    statuses: readonly AttendanceStatus[]
    isSubmitting: boolean
    onFinish: () => void
}

/** Qoralama xulosasi + yakunlash tugmasi. Nol bo'lgan statuslar ko'rsatilmaydi. */
export function DraftBar({ counts, statuses, isSubmitting, onFinish }: DraftBarProps) {
    const { t } = useT()

    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand/40 bg-surface-card px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
                {statuses.map((status) =>
                    counts[status] > 0 ? (
                        <Badge key={status} tone={STATUS_TONE[status]}>
                            {t(`attendance.${status}`)}: {counts[status]}
                        </Badge>
                    ) : null
                )}
            </div>
            <Button variant="success" size="sm" onClick={onFinish} disabled={isSubmitting}>
                {isSubmitting ? t('attendance.submitting') : t('attendance.finish')}
            </Button>
        </div>
    )
}
