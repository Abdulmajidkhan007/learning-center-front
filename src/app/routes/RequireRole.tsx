import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSession } from '@/app/providers/useAuth'
import type { Role } from '@/shared/types'

interface RequireRoleProps {
    roles: Role[]
    children: ReactNode
}

/**
 * Marshrut darajasida rol tekshiruvi.
 *
 * `session.role` ataylab `Role`ga cast QILINMAYDI: u backenddan kelgan
 * oddiy string (`JwtClaims` shuni ko'zlab yozilgan — qarang
 * `shared/types/index.ts`), ro'yxatda yo'q qiymat ham bo'lishi mumkin.
 * Shuning uchun taqqoslash `roles`ni stringga aylantirib qiladi, aksincha
 * emas.
 *
 * DIQQAT — bu HIMOYA EMAS, faqat qulaylik: noto'g'ri rolli foydalanuvchini
 * sahifadan chetlatib, tushunarli holatga (bosh sahifa) qaytaradi. Haqiqiy
 * tekshiruv backendda bo'lishi kerak, lekin hozircha u yerda
 * (`InvoiceController`, `SettingsController` va h.k.) `@PreAuthorize`
 * qo'yilmagan — ya'ni to'g'ri tokeni bo'lgan har qanday foydalanuvchi bu
 * himoyani chetlab o'tib, API'ga to'g'ridan-to'g'ri murojaat qilishi
 * mumkin. Bu qatordagi tekshiruv shuni bekor qilmaydi.
 */
export function RequireRole({ roles, children }: RequireRoleProps) {
    const session = useSession()

    if (!(roles as string[]).includes(session.role)) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
