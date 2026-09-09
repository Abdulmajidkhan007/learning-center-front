import { useState } from 'react'
import { ApiError } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Select } from '@/shared/ui'
import type { SelectOption } from '@/shared/ui'

interface GroupInvoicePanelProps {
    groupOptions: SelectOption[]
    isPending: boolean
    isSuccess: boolean
    error: unknown
    onCreate: (groupId: string) => void
}

/**
 * Guruhga shu oy uchun hisob yaratish.
 *
 * Odatda hisoblar avtomatik yaratiladi; bu blok o'sha avtomatika ishlamay
 * qolganda ishlatiladi. Shuning uchun u ekranning boshida emas, pastroqda
 * turadi — kundalik amal emas.
 */
export function GroupInvoicePanel({
    groupOptions,
    isPending,
    isSuccess,
    error,
    onCreate,
}: GroupInvoicePanelProps) {
    const { t } = useT()
    const [groupId, setGroupId] = useState('')

    /**
     * 409 — bu guruhga shu oy uchun hisob allaqachon yozilgan. Bu xato emas,
     * odatiy holat: administrator ikkinchi marta bosgan. Shuning uchun
     * serverning inglizcha matni o'rniga o'z matnimiz ko'rsatiladi.
     */
    const message =
        error instanceof ApiError && error.status === 409
            ? t('invoice.groupAlreadyCreated')
            : error instanceof Error
              ? error.message
              : null

    return (
        <div className="mt-5 flex flex-wrap items-end gap-2 rounded-lg border border-border-base p-3">
            <Field label={t('invoice.createForGroup')}>
                <Select
                    className="sm:w-56"
                    placeholder={t('field.select')}
                    options={groupOptions}
                    value={groupId}
                    onChange={(event) => setGroupId(event.target.value)}
                />
            </Field>

            <Button size="sm" disabled={groupId === '' || isPending} onClick={() => onCreate(groupId)}>
                {isPending ? t('common.saving') : t('invoice.createForMonth')}
            </Button>

            <p className="w-full text-[0.72rem] leading-snug text-fg-faint">{t('invoice.createForGroupHint')}</p>

            {message != null && (
                <div className="w-full">
                    <ErrorBox>{message}</ErrorBox>
                </div>
            )}

            {isSuccess && message == null && (
                <p className="w-full text-sm text-success-fg">{t('invoice.createForGroupDone')}</p>
            )}
        </div>
    )
}
