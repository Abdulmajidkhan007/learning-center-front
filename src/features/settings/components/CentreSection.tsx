import { useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { ErrorBox, PendingBackend } from '@/shared/ui'
import { CentreForm } from './CentreForm'
import { SettingsSection } from './SettingsSection'
import { useBranch } from '../hooks/useBranch'
import { useMe } from '../hooks/useMe'
import { useUpdateBranch } from '../hooks/useUpdateBranch'

/**
 * Markaz (filial) sozlamalari — faqat administrator ko'radi (SettingsPage tekshiradi).
 *
 * Maydonlar ataylab `BranchDto` bilan bir xil: nomi, manzili, oylik to'lov va
 * xarita havolasi. Ilgari bu yerda logotip, ish vaqti va dam olish kunlari ham
 * bor edi — backendda ular yo'q, ya'ni forma hech qachon saqlay olmasdi.
 */
export function CentreSection() {
    const { t } = useT()
    const session = useSession()

    const { data: me } = useMe(session.token)
    const branch = useBranch(session.token, me?.branchId)
    const save = useUpdateBranch(session.token, me?.branchId)

    return (
        <SettingsSection title={t('settings.centre')} description={t('settings.centreHint')}>
            {branch.error != null && (
                <ErrorBox>
                    {t('settings.centreLoadFailed', { message: errorMessage(branch.error) })}
                </ErrorBox>
            )}

            {branch.isLoading && <p className="text-sm text-fg-faint">{t('common.loading')}</p>}

            {/* Filial ma'lumoti kelgach forma qaytadan yaratiladi (`key`), shuning
                uchun boshlang'ich qiymatlarni ko'chiruvchi effekt kerak emas. */}
            {branch.data && (
                <CentreForm
                    key={branch.data.id}
                    branch={branch.data}
                    isSaving={save.isPending}
                    isSaved={save.isSuccess}
                    error={save.error}
                    onSave={(payload) => save.mutate(payload)}
                />
            )}

            {/* `branchId` faqat backend uni `/auth/me` ga qo'shgandan keyin keladi;
                eski tokenda u bo'lmasligi mumkin. */}
            {!branch.isLoading && !branch.data && branch.error == null && <PendingBackend />}
        </SettingsSection>
    )
}
