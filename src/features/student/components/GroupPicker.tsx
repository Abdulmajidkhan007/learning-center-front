import { useT } from '@/shared/i18n'
import { Field, Select } from '@/shared/ui'
import type { GroupDto } from '@/shared/types'

interface GroupPickerProps {
    groups: GroupDto[]
    selectedId: string
    onSelect: (groupId: string) => void
}

/**
 * Guruh tanlagich.
 *
 * O'quvchi bitta guruhda bo'lsa tanlagich shart emas — o'sha guruh
 * sahifada avtomatik tanlangan bo'ladi, shuning uchun bu yerda hech narsa
 * ko'rsatilmaydi.
 */
export function GroupPicker({ groups, selectedId, onSelect }: GroupPickerProps) {
    const { t } = useT()

    if (groups.length <= 1) return null

    return (
        <Field label={t('teacher.selectGroup')} className="w-full max-w-56">
            <Select
                options={groups.map((group) => ({ value: group.id, label: group.name || group.id }))}
                value={selectedId}
                onChange={(event) => onSelect(event.target.value)}
            />
        </Field>
    )
}
