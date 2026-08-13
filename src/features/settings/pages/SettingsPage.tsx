import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { useT } from '@/shared/i18n'
import { AppShell, Button } from '@/shared/ui'
import { AppearanceSection } from '../components/AppearanceSection'
import { CentreSection } from '../components/CentreSection'
import { PasswordSection } from '../components/PasswordSection'
import { ProfileSection } from '../components/ProfileSection'

export function SettingsPage() {
    const { t } = useT()
    const { signOut } = useAuth()
    const session = useSession()
    const navigate = useNavigate()

    const isAdmin = session.role === 'ADMINISTRATOR' || session.role === 'SUPER_ADMIN'

    return (
        <AppShell
            subtitle={t('settings.title')}
            onSignOut={signOut}
            actions={
                <Button size="sm" onClick={() => navigate('/')}>
                    ← {t('nav.home')}
                </Button>
            }
        >
            {/* Tor ustun: sozlamalar o'qiladigan ro'yxat, keng jadval emas */}
            <div className="mx-auto max-w-2xl">
                <AppearanceSection />
                <ProfileSection />
                <PasswordSection />
                {isAdmin && <CentreSection />}
            </div>
        </AppShell>
    )
}
