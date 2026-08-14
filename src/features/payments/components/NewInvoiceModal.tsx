import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input, Modal, Select, type SelectOption } from '@/shared/ui'

interface NewInvoiceModalProps {
    studentOptions: SelectOption[]
    isSaving: boolean
    error: unknown
    onSubmit: (payload: { studentId: string; amount: number }) => void
    onClose: () => void
}

export function NewInvoiceModal({
    studentOptions,
    isSaving,
    error,
    onSubmit,
    onClose,
}: NewInvoiceModalProps) {
    const { t } = useT()
    const [studentId, setStudentId] = useState('')
    const [amount, setAmount] = useState('')

    const parsedAmount = Number(amount)
    const isValid = studentId !== '' && amount !== '' && parsedAmount > 0

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!isValid) return
        onSubmit({ studentId, amount: parsedAmount })
    }

    return (
        <Modal eyebrow={t('invoice.new')} title={t('invoice.newTitle')} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('invoice.student')}>
                    <Select
                        placeholder={t('field.select')}
                        options={studentOptions}
                        value={studentId}
                        onChange={(event) => setStudentId(event.target.value)}
                    />
                </Field>

                <Field label={t('invoice.amount')}>
                    <Input
                        type="number"
                        min="0"
                        step="any"
                        inputMode="decimal"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                    />
                </Field>

                {/* Hisob doim PENDING bo'lib yaratiladi — buni backend qo'yadi,
                    shuning uchun formada status maydoni yo'q. */}
                <p className="text-sm leading-relaxed text-fg-muted">{t('invoice.createHint')}</p>

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
