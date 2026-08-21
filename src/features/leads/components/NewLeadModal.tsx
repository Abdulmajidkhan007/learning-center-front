import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input, Modal, Select } from '@/shared/ui'
import { LEAD_SOURCES } from '@/shared/types'
import { toLocalDateTime } from '../lib/format'
import type { LeadSource } from '@/shared/types'

interface NewLeadModalProps {
    isSaving: boolean
    error: unknown
    onSubmit: (payload: {
        fullName: string
        phone: string
        callAt?: string
        source: LeadSource
        preferredCourse?: string
    }) => void
    onClose: () => void
}

export function NewLeadModal({ isSaving, error, onSubmit, onClose }: NewLeadModalProps) {
    const { t } = useT()
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [callAt, setCallAt] = useState('')
    const [source, setSource] = useState<LeadSource | ''>('')
    const [preferredCourse, setPreferredCourse] = useState('')

    const isValid = fullName.trim() !== '' && phone.trim() !== '' && source !== ''

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!isValid) return
        onSubmit({
            fullName: fullName.trim(),
            phone: phone.trim(),
            callAt: toLocalDateTime(callAt),
            source,
            preferredCourse: preferredCourse.trim() || undefined,
        })
    }

    return (
        <Modal eyebrow={t('lead.new')} title={t('lead.newTitle')} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('lead.fullName')}>
                    <Input value={fullName} onChange={(event) => setFullName(event.target.value)} />
                </Field>

                <Field label={t('lead.phone')}>
                    <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
                </Field>

                <Field label={t('lead.source')}>
                    <Select
                        placeholder={t('field.select')}
                        options={LEAD_SOURCES.map((value) => ({
                            value,
                            label: t(`lead.source.${value}`),
                        }))}
                        value={source}
                        onChange={(event) => setSource(event.target.value as LeadSource)}
                    />
                </Field>

                <Field label={t('lead.callAt')}>
                    <Input
                        type="datetime-local"
                        value={callAt}
                        onChange={(event) => setCallAt(event.target.value)}
                    />
                </Field>

                <Field label={t('lead.preferredCourse')}>
                    <Input
                        value={preferredCourse}
                        onChange={(event) => setPreferredCourse(event.target.value)}
                    />
                </Field>

                {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

                <div className="mt-1 flex justify-end gap-2.5">
                    <Button onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit" variant="primary" disabled={isSaving || !isValid}>
                        {isSaving ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
