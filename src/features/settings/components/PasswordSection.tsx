import { useState, type FormEvent } from 'react'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input, PendingBackend, PendingTag } from '@/shared/ui'
import { validatePasswordChange } from '../lib/validatePassword'
import { SettingsSection } from './SettingsSection'

export function PasswordSection() {
    const { t } = useT()
    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [repeat, setRepeat] = useState('')
    const [issue, setIssue] = useState<string | null>(null)

    // Tekshiruv haqiqiy ishlaydi — yuborish esa endpoint kelguncha o'chirilgan.
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const result = validatePasswordChange({ current, next, repeat })
        setIssue(result === 'mismatch' ? t('settings.passwordMismatch') : null)
    }

    return (
        <SettingsSection
            title={t('settings.password')}
            description={t('settings.passwordHint')}
            tag={<PendingTag />}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('settings.currentPassword')}>
                    <Input
                        type="password"
                        autoComplete="current-password"
                        value={current}
                        onChange={(event) => setCurrent(event.target.value)}
                    />
                </Field>
                <Field label={t('settings.newPassword')}>
                    <Input
                        type="password"
                        autoComplete="new-password"
                        value={next}
                        onChange={(event) => setNext(event.target.value)}
                    />
                </Field>
                <Field label={t('settings.repeatPassword')}>
                    <Input
                        type="password"
                        autoComplete="new-password"
                        value={repeat}
                        onChange={(event) => setRepeat(event.target.value)}
                    />
                </Field>

                {issue && <ErrorBox>{issue}</ErrorBox>}

                <PendingBackend />

                <div className="flex justify-end">
                    <Button type="submit" variant="primary" disabled>
                        {t('common.save')}
                    </Button>
                </div>
            </form>
        </SettingsSection>
    )
}
