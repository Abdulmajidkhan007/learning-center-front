import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input, Modal, Select, type SelectOption } from '@/shared/ui'
import type { BranchPayload } from '../api/superAdminApi'
import type { BranchDto } from '@/shared/types'

interface Props {
    branch: BranchDto | null
    organizationOptions: SelectOption[]
    isSaving: boolean
    error: unknown
    onSubmit: (body: BranchPayload) => void
    onClose: () => void
}

export function BranchFormModal({
    branch,
    organizationOptions,
    isSaving,
    error,
    onSubmit,
    onClose,
}: Props) {
    const { t } = useT()
    const isEdit = branch !== null
    const [organizationId, setOrganizationId] = useState('')
    const [name, setName] = useState(branch?.name ?? '')
    const [address, setAddress] = useState(branch?.address ?? '')
    const [chargeForMonth, setChargeForMonth] = useState(
        branch?.chargeForMonth === undefined ? '' : String(branch.chargeForMonth)
    )

    // Yaratishda tashkilot shart: `BranchCreateDto.organizationId` busiz
    // filial hech qaysi tashkilotga bog'lanmay qoladi.
    const isValid = name.trim() !== '' && (isEdit || organizationId !== '')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!isValid) return
        onSubmit({
            name: name.trim(),
            address,
            chargeForMonth: chargeForMonth === '' ? undefined : Number(chargeForMonth),
            organizationId: isEdit ? undefined : organizationId,
        })
    }

    return (
        <Modal
            eyebrow={isEdit ? t('admin.editRecord') : t('admin.newRecord')}
            title={isEdit ? t('branch.editTitle') : t('branch.newTitle')}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                {!isEdit && (
                    <Field label={t('branch.organization')}>
                        <Select
                            placeholder={t('field.select')}
                            options={organizationOptions}
                            value={organizationId}
                            onChange={(e) => setOrganizationId(e.target.value)}
                        />
                    </Field>
                )}

                <Field label={t('branch.name')}>
                    <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </Field>
                <Field label={t('branch.address')}>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                </Field>
                <Field label={t('branch.chargeForMonth')}>
                    <Input
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={chargeForMonth}
                        onChange={(e) => setChargeForMonth(e.target.value)}
                    />
                </Field>

                {isEdit && (
                    <p className="text-[0.72rem] leading-snug text-fg-faint">
                        {t('branch.organizationLocked')}
                    </p>
                )}

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
