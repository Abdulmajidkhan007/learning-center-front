import { useState, type FormEvent } from 'react'
import { useT } from '@/shared/i18n'
import { Button, Input } from '@/shared/ui'

interface RemoveFromGroupFormProps {
    isPending: boolean
    onSubmit: (reason: string) => void
    onCancel: () => void
}

/**
 * Guruhdan chiqarish sababi.
 *
 * Alohida modal EMAS: bu forma allaqachon ochiq modal ichida ko'rinadi,
 * modal ustiga modal esa mobil ekranda ishlatib bo'lmas holga keladi.
 * Sabab majburiy — backend uni `@RequestParam` sifatida talab qiladi.
 */
export function RemoveFromGroupForm({ isPending, onSubmit, onCancel }: RemoveFromGroupFormProps) {
    const { t } = useT()
    const [reason, setReason] = useState('')
    const trimmed = reason.trim()

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (trimmed === '') return
        onSubmit(trimmed)
    }

    return (
        <form onSubmit={handleSubmit} className="mt-2 flex flex-wrap items-center gap-2">
            <Input
                autoFocus
                className="min-w-40 flex-1"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder={t('admin.removeReasonPlaceholder')}
                aria-label={t('admin.removeReason')}
            />
            <Button type="submit" size="sm" variant="danger" disabled={isPending || trimmed === ''}>
                {t('admin.removeConfirm')}
            </Button>
            <Button size="sm" onClick={onCancel}>
                {t('common.cancel')}
            </Button>
        </form>
    )
}
