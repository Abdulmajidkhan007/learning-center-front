import { useState } from 'react'
import { useSession } from '@/app/providers/useAuth'
import { useT } from '@/shared/i18n'
import { Button, Field, Input, PendingBackend, PendingTag } from '@/shared/ui'
import { SettingsSection } from './SettingsSection'

/**
 * Profil.
 *
 * `/me` endpoint'i yo'q, shuning uchun boshlang'ich qiymatlar JWT
 * claim'laridan olinadi (u yerda nima bo'lsa). Saqlash tugmasi o'chirilgan —
 * endpoint qo'shilgach `disabled` olib tashlanadi va mutatsiya ulanadi.
 */
export function ProfileSection() {
    const { t } = useT()
    const session = useSession()

    const claims = session.claims
    const [fullName, setFullName] = useState(typeof claims.name === 'string' ? claims.name : '')
    const [phone, setPhone] = useState(typeof claims.phone === 'string' ? claims.phone : '')
    const [birthDate, setBirthDate] = useState('')

    return (
        <SettingsSection
            title={t('settings.profile')}
            description={t('settings.profileHint')}
            tag={<PendingTag />}
        >
            <div className="flex flex-col gap-3.5">
                <Field label={t('field.fullName')}>
                    <Input value={fullName} onChange={(event) => setFullName(event.target.value)} />
                </Field>
                <Field label={t('field.phone')}>
                    <Input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                    />
                </Field>
                <Field label={t('field.birthDate')}>
                    <Input
                        type="date"
                        value={birthDate}
                        onChange={(event) => setBirthDate(event.target.value)}
                    />
                </Field>

                <PendingBackend />

                <div className="flex justify-end">
                    <Button variant="primary" disabled>
                        {t('common.save')}
                    </Button>
                </div>
            </div>
        </SettingsSection>
    )
}
