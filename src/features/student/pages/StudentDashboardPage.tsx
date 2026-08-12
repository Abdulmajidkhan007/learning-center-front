import { useAuth } from '@/app/providers/useAuth'
import { DashboardShell, EmptyState } from '@/shared/ui'

/**
 * O'quvchi paneli hali qurilmagan.
 *
 * Bo'sh fayl o'rniga to'liq ekran: STUDENT roli bilan kirgan odam nima
 * bo'layotganini tushunsin va "buzilib qoldi" deb o'ylamasin.
 */
export function StudentDashboardPage() {
    const { signOut } = useAuth()

    return (
        <DashboardShell subtitle="Cornerstone · Student" onSignOut={signOut}>
            <EmptyState
                title="Your student dashboard is on the way."
                description="Your account is active — this screen just hasn't been built yet."
            />
        </DashboardShell>
    )
}
