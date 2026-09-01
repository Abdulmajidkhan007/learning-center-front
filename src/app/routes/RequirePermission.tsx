import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSession } from '@/app/providers/useAuth'
import type { AdminPermission } from '@/shared/types'

interface RequirePermissionProps {
    permission: AdminPermission
    children: ReactNode
}

/**
 * Marshrut darajasida ruxsat tekshiruvi — `RequireRole` bilan birga
 * ishlatiladi (`/leads`, `/payments`).
 *
 * Faqat `ADMINISTRATOR` uchun ma'noli: `SUPER_ADMIN` cheklovsiz, `TEACHER`
 * kabi boshqa rollarda `permissions` umuman yo'q — ular `RequireRole`
 * allaqachon cheklagan, shuning uchun bu yerda tekshirilmaydi.
 *
 * DIQQAT — bu ham `RequireRole` kabi HIMOYA EMAS, faqat qulaylik: haqiqiy
 * tekshiruv backendda (`@PreAuthorize`).
 */
export function RequirePermission({ permission, children }: RequirePermissionProps) {
    const session = useSession()

    if (session.role === 'ADMINISTRATOR' && !session.permissions.includes(permission)) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
