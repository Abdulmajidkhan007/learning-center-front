import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage'
import { StudentDashboardPage } from '@/features/student/pages/StudentDashboardPage'
import { SuperAdminDashboardPage } from '@/features/super-admin/pages/SuperAdminDashboardPage'
import { TeacherDashboardPage } from '@/features/teacher/pages/TeacherDashboardPage'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useT } from '@/shared/i18n'
import { AppShell, EmptyState } from '@/shared/ui'

/**
 * Rolga qarab kerakli dashboardni ko'rsatadi.
 *
 * Noma'lum rol xato emas: backend yangi rol qo'shsa, foydalanuvchi bo'sh
 * ekran emas, tushunarli xabar ko'rishi kerak.
 */
export function RoleDashboard() {
    const { t } = useT()
    const session = useSession()
    const { signOut } = useAuth()

    switch (session.role) {
        case 'ADMINISTRATOR':
            return <AdminDashboardPage />
        case 'TEACHER':
            return <TeacherDashboardPage />
        case 'STUDENT':
            return <StudentDashboardPage />
        case 'SUPER_ADMIN':
            return <SuperAdminDashboardPage />
        default:
            return (
                <AppShell subtitle={session.role} onSignOut={signOut}>
                    <div className="mx-auto max-w-xl">
                        <EmptyState title={t('pending.title')} description={t('pending.body')} />
                    </div>
                </AppShell>
            )
    }
}
