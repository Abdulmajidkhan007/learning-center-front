import { useState, type FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { errorMessage, queryKeys } from '@/shared/api'
import { useMyOrganization } from '@/shared/hooks'
import { useT } from '@/shared/i18n'
import { formatPhone, normalizePhone } from '@/shared/lib'
import { Button, ErrorBox, Eyebrow, Field, Input, Panel } from '@/shared/ui'
import { updateOwnOrganization } from '../api/superAdminApi'
import type { OrganizationDto } from '@/shared/types'

/**
 * Super-adminning O'Z markazi.
 *
 * Tashkilotlar RO'YXATI bu panelda yo'q: markaz egasi boshqa markazlarni
 * ko'rmasligi kerak. Yangi tashkilot ochish ham bu yerda emas — u faqat
 * dasturchi panelida bo'ladi.
 */
export function OrganizationPanel({
    token,
    organizationId,
}: {
    token: string
    organizationId?: string
}) {
    const { data: organization, isLoading } = useMyOrganization(token, organizationId)

    if (isLoading || !organization) return null

    /*
     * Forma ALOHIDA komponentda va `key` bilan qayta yaratiladi.
     *
     * Aks holda ma'lumot kelganda uni effekt ichida `setState` bilan
     * to'ldirishga to'g'ri kelardi — bu `react-hooks/set-state-in-effect`
     * qoidasiga ziddir va yozib turgan matn ustiga eski qiymat tushish
     * xavfi bor. `key` o'zgarsa React komponentni yangidan yaratadi va
     * boshlang'ich qiymatlar o'zi to'g'ri bo'ladi.
     */
    return (
        <OrganizationForm
            key={organization.id}
            token={token}
            organizationId={organizationId ?? organization.id}
            initial={organization}
        />
    )
}

function OrganizationForm({
    token,
    organizationId,
    initial,
}: {
    token: string
    organizationId: string
    initial: OrganizationDto
}) {
    const { t } = useT()
    const queryClient = useQueryClient()

    const [name, setName] = useState(initial.name ?? '')
    const [phone, setPhone] = useState(formatPhone(initial.phone ?? ''))
    const [email, setEmail] = useState(initial.email ?? '')
    const [website, setWebsite] = useState(initial.website ?? '')

    const save = useMutation({
        mutationFn: () =>
            updateOwnOrganization(token, organizationId, {
                name: name.trim(),
                phone: normalizePhone(phone) || undefined,
                email: email.trim() || undefined,
                website: website.trim() || undefined,
            }),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.organization(organizationId) })
        },
    })

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        save.mutate()
    }

    return (
        <Panel>
            <Eyebrow>{t('superAdmin.section.organization')}</Eyebrow>

            <form onSubmit={handleSubmit} className="mt-4 flex max-w-lg flex-col gap-3.5">
                <Field label={t('field.organizationName')}>
                    <Input required value={name} onChange={(event) => setName(event.target.value)} />
                </Field>

                <Field label={t('field.phone')}>
                    <Input
                        type="tel"
                        value={phone}
                        onChange={(event) => setPhone(formatPhone(event.target.value))}
                    />
                </Field>

                <Field label={t('organization.email')}>
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </Field>

                <Field label={t('organization.website')}>
                    <Input value={website} onChange={(event) => setWebsite(event.target.value)} />
                </Field>

                {save.error != null && <ErrorBox>{errorMessage(save.error)}</ErrorBox>}

                <div className="mt-1 flex items-center justify-end gap-3">
                    {save.isSuccess && !save.isPending && (
                        <span className="text-sm text-success-fg">
                            {t('superAdmin.organizationSaved')}
                        </span>
                    )}
                    <Button type="submit" variant="primary" disabled={save.isPending}>
                        {save.isPending ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            </form>
        </Panel>
    )
}
