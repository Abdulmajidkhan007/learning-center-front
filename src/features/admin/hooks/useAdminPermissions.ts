import { useHasPermission } from '@/app/providers/useAuth'
import { ENTITIES } from '../config/entities'
import type { EntityConfig } from '../types'

/**
 * Administratorga ruxsatiga qarab ko'rinadigan bo'limlar va tugmalar.
 *
 * Guruhlar va Darslar uchun ruxsat yo'q — ular doim ko'rinadi, shuning uchun
 * `entity.permission` bo'lmagan yozuvlar filtrga tushmaydi.
 */
export function useAdminPermissions(): {
    visibleEntities: EntityConfig[]
    hasLeadPermission: boolean
    hasInvoicePermission: boolean
} {
    const hasStudentPermission = useHasPermission('STUDENT_MANAGEMENT')
    const hasTeacherPermission = useHasPermission('TEACHER_MANAGEMENT')
    const hasLeadPermission = useHasPermission('LEAD_MANAGEMENT')
    const hasInvoicePermission = useHasPermission('INVOICE_MANAGEMENT')

    const visibleEntities = ENTITIES.filter((entity) => {
        if (entity.permission === 'STUDENT_MANAGEMENT') return hasStudentPermission
        if (entity.permission === 'TEACHER_MANAGEMENT') return hasTeacherPermission
        return true
    })

    return { visibleEntities, hasLeadPermission, hasInvoicePermission }
}
