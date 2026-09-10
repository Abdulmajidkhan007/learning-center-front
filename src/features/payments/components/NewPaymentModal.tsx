import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input, Modal, Select, type SelectOption } from '@/shared/ui'
import { TRANSACTION_TYPES, type TransactionType } from '@/shared/types'

interface NewPaymentModalProps {
    studentOptions: SelectOption[]
    isSaving: boolean
    error: unknown
    onSubmit: (payload: { type: TransactionType; amount: number; studentId: string }) => void
    onClose: () => void
}

/**
 * To'lov yozish oynasi.
 *
 * Hisob tanlanmaydi: backend to'lovni o'quvchining eng so'nggi hisobiga
 * o'zi bog'laydi. Shuning uchun formada faqat kim, nima turda va qancha.
 */
export function NewPaymentModal({
    studentOptions,
    isSaving,
    error,
    onSubmit,
    onClose,
}: NewPaymentModalProps) {
    const { t } = useT()
    const [studentId, setStudentId] = useState('')
    const [type, setType] = useState<TransactionType>('PAID')
    const [amount, setAmount] = useState('')

    const parsedAmount = Number(amount)
    const isValid = studentId !== '' && amount !== '' && Number.isFinite(parsedAmount) && parsedAmount > 0

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!isValid) return
        onSubmit({ type, amount: parsedAmount, studentId })
    }

    return (
        <Modal eyebrow={t('transaction.eyebrow')} title={t('transaction.newTitle')} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('invoice.student')}>
                    <Select
                        placeholder={t('field.select')}
                        options={studentOptions}
                        value={studentId}
                        onChange={(event) => setStudentId(event.target.value)}
                    />
                </Field>

                <Field label={t('transaction.type')}>
                    <Select
                        options={TRANSACTION_TYPES.map((value) => ({
                            value,
                            label: t(`transaction.type.${value}`),
                        }))}
                        value={type}
                        onChange={(event) => setType(event.target.value as TransactionType)}
                    />
                </Field>

                <Field label={t('invoice.amount')}>
                    <Input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                    />
                </Field>

                <p className="text-[0.72rem] leading-snug text-fg-faint">{t('transaction.hint')}</p>

                {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

                <div className="mt-1 flex justify-end gap-2.5">
                    <Button onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit" variant="primary" disabled={!isValid || isSaving}>
                        {isSaving ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
