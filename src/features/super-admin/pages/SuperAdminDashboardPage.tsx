import { useAuth } from '@/app/providers/useAuth'
import { DashboardShell, EmptyState } from '@/shared/ui'

/** Super-admin paneli hali qurilmagan — StudentDashboardPage bilan bir xil sabab. */
export function SuperAdminDashboardPage() {
    const { signOut } = useAuth()

    return (
        <DashboardShell subtitle="Cornerstone · Super Admin" onSignOut={signOut}>
            <EmptyState
                title="The super-admin dashboard is on the way."
                description="Centre-wide settings and cross-branch reports will live here."
            />
        </DashboardShell>
    )
}
