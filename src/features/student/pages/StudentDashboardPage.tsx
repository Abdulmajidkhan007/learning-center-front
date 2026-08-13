import { useAuth } from '@/app/providers/useAuth'
import { useT } from '@/shared/i18n'
import { AppShell, EmptyState, PendingBackend } from '@/shared/ui'

/**
 * O'quvchi paneli hali qurilmagan.
 *
 * Bo'sh fayl o'rniga to'liq ekran: STUDENT roli bilan kirgan odam nima
 * bo'layotganini tushunsin va "buzilib qoldi" deb o'ylamasin.
 */
export function StudentDashboardPage() {
    const { t } = useT()
    const { signOut } = useAuth()

    return (
        <AppShell subtitle={t('entity.students.singular')} onSignOut={signOut}>
            <div className="mx-auto max-w-xl">
                <EmptyState title={t('pending.title')} description={t('pending.body')} />
                <div className="mt-4">
                    <PendingBackend />
                </div>
            </div>
        </AppShell>
    )
}
