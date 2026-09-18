import { useT } from '@/shared/i18n'
import { Avatar, Button } from '@/shared/ui'
import type { UserDto } from '@/shared/types'

/**
 * "Bu raqam tizimda bor" xabari.
 *
 * Ma'lumot JIMGINA to'ldirilmaydi, avval tasdiq so'raladi. Sabab: telefon
 * raqamlari bekor qilinib boshqa odamga beriladi. Jimgina to'ldirsak,
 * administrator yangi kelgan bolani eski egasining hisobiga yozib yuboradi
 * va buni sezmaydi — davomati, to'lovi, balansi begona odamga ketadi.
 */
export function ExistingUserNotice({
    user,
    onConfirm,
    onReject,
}: {
    user: UserDto
    onConfirm: () => void
    onReject: () => void
}) {
    const { t } = useT()

    return (
        <div className="rounded-lg border border-accent/30 bg-accent-soft p-3">
            <p className="mb-2.5 text-sm text-accent-fg">{t('lookup.found')}</p>

            <div className="flex items-center gap-2.5">
                <Avatar name={user.fullName} src={user.imageUrl} size="sm" fallback="silhouette" />
                <div className="min-w-0">
                    <p className="truncate font-medium text-fg">{user.fullName}</p>
                    {user.birthDate && (
                        <p className="font-mono text-xs text-fg-muted">{user.birthDate}</p>
                    )}
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="primary" onClick={onConfirm}>
                    {t('lookup.yesSame')}
                </Button>
                <Button size="sm" onClick={onReject}>
                    {t('lookup.notSame')}
                </Button>
            </div>
        </div>
    )
}
