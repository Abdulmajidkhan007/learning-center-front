import { useAuth } from '@/app/providers/useAuth'
import { useT } from '@/shared/i18n'
import { AppShell, EmptyState, PendingBackend } from '@/shared/ui'

/** Super-admin paneli hali qurilmagan — StudentDashboardPage bilan bir xil sabab. */
export function SuperAdminDashboardPage() {
    const { t } = useT()
    const { signOut } = useAuth()

    return (
        <AppShell subtitle={t('admin.role')} onSignOut={signOut}>
            <div className="mx-auto max-w-xl">
                <EmptyState title={t('pending.title')} description={t('pending.body')} />
                <div className="mt-4">
                    <PendingBackend />
                </div>
            </div>
        </AppShell>
    )
}
