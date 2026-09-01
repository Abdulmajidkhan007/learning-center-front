import { useState } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input } from '@/shared/ui'
import type { BranchDto, BranchUpdatePayload } from '@/shared/types'

interface CentreFormProps {
    branch: BranchDto
    isSaving: boolean
    isSaved: boolean
    error: unknown
    onSave: (payload: BranchUpdatePayload) => void
}

/**
 * Markaz formasi — boshlang'ich qiymatlarni prop'dan oladi.
 *
 * Chaqiruvchi buni `key={branch.id}` bilan render qiladi: filial almashsa
 * komponent qaytadan yaratiladi va holat o'zi yangilanadi. Shu sabab bu yerda
 * serverdan kelgan ma'lumotni state'ga ko'chiradigan `useEffect` kerak emas.
 */
export function CentreForm({ branch, isSaving, isSaved, error, onSave }: CentreFormProps) {
    const { t } = useT()

    const [name, setName] = useState(branch.name ?? '')
    const [address, setAddress] = useState(branch.address ?? '')
    const [googleMapsUrl, setGoogleMapsUrl] = useState(branch.googleMapsUrl ?? '')

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        onSave({
            name: name.trim(),
            address: address.trim(),
            googleMapsUrl: googleMapsUrl.trim(),
        })
    }

    return (
        <form className="flex flex-col gap-3.5" onSubmit={handleSubmit}>
            <Field label={t('settings.centreName')}>
                <Input value={name} onChange={(event) => setName(event.target.value)} />
            </Field>

            <Field label={t('settings.centreAddress')}>
                <Input value={address} onChange={(event) => setAddress(event.target.value)} />
            </Field>

            <Field label={t('settings.centreMapsUrl')}>
                <Input
                    type="url"
                    placeholder="https://…"
                    value={googleMapsUrl}
                    onChange={(event) => setGoogleMapsUrl(event.target.value)}
                />
            </Field>

            {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}
            {isSaved && <p className="text-sm text-success-fg">{t('settings.centreSaved')}</p>}

            <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={isSaving}>
                    {isSaving ? t('common.saving') : t('common.save')}
                </Button>
            </div>
        </form>
    )
}
