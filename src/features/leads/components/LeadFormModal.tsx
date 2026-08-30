import { useState } from 'react'
import type { LeadCreateDto, LeadDto, LeadSource, LeadUpdateDto } from '@/shared/types'
import { LEAD_SOURCES } from '@/shared/types'
import { useT } from '@/shared/i18n'
import { Button, Field, Input, Modal, Select } from '@/shared/ui'
import { useLeadCourseOptions } from '../hooks/useLeads'

const PHONE_RE = /^\+?[1-9]\d{1,14}$/

export interface LeadFormModalProps {
    token: string
    lead?: LeadDto | null
    isPending?: boolean
    onClose: () => void
    onSubmit: (data: LeadCreateDto | LeadUpdateDto) => void
}

export function LeadFormModal({ token, lead, isPending, onClose, onSubmit }: LeadFormModalProps) {
    const { t } = useT()
    const courseOptions = useLeadCourseOptions(token)

    const isEdit = Boolean(lead)
    const [fullName, setFullName] = useState(lead?.fullName ?? '')
    const [phone, setPhone] = useState(lead?.phone ?? '')
    const [source, setSource] = useState<LeadSource | ''>(lead?.source ?? '')
    const [preferredCourse, setPreferredCourse] = useState(lead?.preferredCourse?.id ?? '')

    const isValid = fullName.trim() !== '' && PHONE_RE.test(phone.trim())

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!isValid) return

        const trimmedName = fullName.trim()
        const trimmedPhone = phone.trim()
        const trimmedCourse = preferredCourse.trim() || undefined

        if (isEdit && lead) {
            const body: LeadUpdateDto = {
                fullName: trimmedName,
                phone: trimmedPhone,
                source: source || undefined,
                preferredCourse: trimmedCourse,
                status: lead.status ?? 'NEW',
            }
            onSubmit(body)
        } else {
            const body: LeadCreateDto = {
                fullName: trimmedName,
                phone: trimmedPhone,
                source: source || undefined,
                preferredCourse: trimmedCourse,
            }
            onSubmit(body)
        }
    }

    return (
        <Modal
            eyebrow={isEdit ? 'EDIT LEAD' : 'NEW LEAD'}
            title={isEdit ? t('lead.editTitle') : t('lead.newTitle')}
            onClose={onClose}
            footer={
                <>
                    <Button onClick={onClose}>{t('common.cancel')}</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={!isValid || isPending}>
                        {t('common.save')}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <Field label={t('lead.fullName')}>
                    <Input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
                </Field>
                <Field label={t('lead.phone')}>
                    <Input
                        type="tel"
                        placeholder="+998901234567"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        required
                    />
                    <p className="mt-1 text-xs text-fg-muted">International format, e.g. +998901234567</p>
                </Field>
                <Field label={t('lead.source')}>
                    <Select
                        placeholder="Select source"
                        value={source}
                        options={LEAD_SOURCES.map((src) => ({ value: src, label: t(`lead.source.${src}`) || src }))}
                        onChange={(event) => setSource(event.target.value as LeadSource | '')}
                    />
                </Field>
                <Field label={t('lead.preferredCourse')}>
                    <Select
                        placeholder="Select level"
                        value={preferredCourse}
                        options={courseOptions.data ?? []}
                        onChange={(event) => setPreferredCourse(event.target.value)}
                    />
                </Field>
            </form>
        </Modal>
    )
}
