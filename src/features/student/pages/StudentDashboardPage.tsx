import { useAuth, useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { AppShell, EmptyState, ErrorBox, Eyebrow, Panel, PendingBackend } from '@/shared/ui'
import { useMe } from '@/features/settings/hooks/useMe'
import { ProfileCard } from '../components/ProfileCard'
import { useMyStudentRecord } from '../hooks/useMyStudentRecord'

/**
 * O'quvchi paneli.
 *
 * Hozircha faqat profil to'liq ishlaydi. Davomat va guruh uchun
 * "o'zimniki" endpoint'i yo'q: `GET /attendance` butun markazning
 * yozuvlarini qaytaradi, ya'ni mijozda filtrlash boshqa o'quvchilarning
 * ma'lumotini ham yuklab olish demak. Shuning uchun ular ataylab
 * qilinmadi — kerakli endpoint'lar `docs/backend-notes.md` da.
 */
export function StudentDashboardPage() {
    const { t } = useT()
    const { signOut } = useAuth()
    const session = useSession()

    const { data: me, isLoading, error } = useMe(session.token)
    const { data: student } = useMyStudentRecord(session.token, me?.phone)

    return (
        <AppShell subtitle={t('student.role')} onSignOut={signOut}>
            <div className="mx-auto max-w-2xl">
                {isLoading && <p className="text-sm text-fg-faint">{t('common.loading')}</p>}

                {error != null && (
                    <div className="mb-5">
                        <ErrorBox>{errorMessage(error)}</ErrorBox>
                    </div>
                )}

                {me && <ProfileCard user={me} student={student ?? null} />}

                {me && !student && (
                    <div className="mb-5">
                        <EmptyState title={t('student.notFound')} description={t('student.notFoundHint')} />
                    </div>
                )}

                <Panel className="mb-5">
                    <Eyebrow>{t('student.attendance')}</Eyebrow>
                    <p className="mt-1 mb-4 text-sm text-fg-muted">{t('student.attendanceHint')}</p>
                    <PendingBackend />
                </Panel>

                <Panel>
                    <Eyebrow>{t('student.group')}</Eyebrow>
                    <p className="mt-1 mb-4 text-sm text-fg-muted">{t('student.groupHint')}</p>
                    <PendingBackend />
                </Panel>
            </div>
        </AppShell>
    )
}
