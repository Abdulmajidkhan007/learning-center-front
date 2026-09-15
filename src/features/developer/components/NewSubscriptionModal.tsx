import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input, Modal, Select } from '@/shared/ui'
import type { SelectOption } from '@/shared/ui'
import type { SubscriptionCreatePayload } from '@/shared/types'

interface NewSubscriptionModalProps {
    organizations: SelectOption[]
    plans: SelectOption[]
    isSaving: boolean
    error: unknown
    onSubmit: (body: SubscriptionCreatePayload) => void
    onClose: () => void
}

export function NewSubscriptionModal({
    organizations,
    plans,
    isSaving,
    error,
    onSubmit,
    onClose,
}: NewSubscriptionModalProps) {
    const { t } = useT()
    const [organizationId, setOrganizationId] = useState('')
    const [planId, setPlanId] = useState('')
    const [note, setNote] = useState('')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onSubmit({ organizationId, planId, note: note.trim() || undefined })
    }

    return (
        <Modal eyebrow={t('developer.subscriptionsTab')} title={t('subscription.newTitle')} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('subscription.organization')}>
                    <Select
                        required
                        value={organizationId}
                        onChange={(event) => setOrganizationId(event.target.value)}
                        options={organizations}
                        placeholder={t('subscription.organization')}
                    />
                </Field>

                <Field label={t('subscription.plan')}>
                    <Select
                        required
                        value={planId}
                        onChange={(event) => setPlanId(event.target.value)}
                        options={plans}
                        placeholder={t('subscription.plan')}
                    />
                </Field>

                <Field label={t('subscription.note')}>
                    <Input value={note} onChange={(event) => setNote(event.target.value)} />
                </Field>
                <p className="-mt-2 text-[0.72rem] leading-snug text-fg-faint">
                    {t('subscription.noteHint')}
                </p>

                {/* Uzaytirish alohida amal emas: mavjud obuna bo'lsa backend
                    yangi muddatni uning tugashidan davom ettiradi. */}
                <p className="text-[0.72rem] leading-snug text-fg-faint">{t('subscription.renewHint')}</p>

                {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

                <div className="mt-1 flex justify-end gap-2.5">
                    <Button onClick={onClose}>{t('common.cancel')}</Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSaving || organizationId === '' || planId === ''}
                    >
                        {isSaving ? t('common.saving') : t('subscription.new')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
