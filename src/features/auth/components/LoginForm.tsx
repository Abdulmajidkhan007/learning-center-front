import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input } from '@/shared/ui'
import { useLogin } from '../hooks/useLogin'
import type { Session } from '@/shared/types'

export function LoginForm({ onLoggedIn }: { onLoggedIn: (session: Session) => void }) {
    const { t } = useT()
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)

    const { mutate, isPending, error } = useLogin(onLoggedIn)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        mutate({ phone, password, rememberMe })
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label={t('auth.phone')}>
                <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+998 90 123 45 67"
                    autoComplete="tel"
                />
            </Field>

            <Field label={t('auth.password')}>
                <Input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                />
            </Field>

            <label className="flex items-center gap-2 text-sm text-fg-muted">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="size-4 cursor-pointer"
                />
                {t('auth.keepSignedIn')}
            </label>

            {error && <ErrorBox>{errorMessage(error, t('auth.invalidCredentials'))}</ErrorBox>}

            <Button type="submit" variant="primary" disabled={isPending} className="mt-2 py-3">
                {isPending ? t('auth.signingIn') : t('auth.signIn')}
            </Button>
        </form>
    )
}
