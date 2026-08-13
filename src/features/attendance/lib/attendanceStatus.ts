import type { BadgeTone } from '@/shared/ui'
import type { AttendanceStatus } from '@/shared/types'

/** Status → nishon rangi. Yangi status qo'shilsa, TS bu yerni majburan eslatadi. */
export const STATUS_TONE: Record<AttendanceStatus, BadgeTone> = {
    PRESENT: 'success',
    ABSENT: 'danger',
    LATE: 'warning',
    EXCUSED: 'neutral',
}
