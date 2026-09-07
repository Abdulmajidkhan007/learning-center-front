import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useTheme } from '@/app/providers/useTheme'
import { useT } from '@/shared/i18n'
import { AppShell, Button, EmptyState } from '@/shared/ui'

/** Mavjud bo'lmagan manzil ochilganda. */
export function NotFoundPage() {
    const { t } = useT()
    const { signOut } = useAuth()
    const session = useSession()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    return (
        <AppShell
            subtitle="404"
            onSignOut={signOut}
            token={session.token}
            theme={theme}
            toggleTheme={toggleTheme}
            actions={
                <Button size="sm" onClick={() => navigate('/')}>
                    ← {t('nav.home')}
                </Button>
            }
        >
            <div className="mx-auto max-w-xl">
                <EmptyState title={t('error.notFound')} description={t('error.notFoundHint')} />
            </div>
        </AppShell>
    )
}
