import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Avatar, ErrorBox, Input, Pagination, Panel } from '@/shared/ui'
import { SimpleTable } from './SimpleTable'
import { usePeople } from '../hooks/usePeople'
import type { PeopleKind, PersonRow } from '../api/superAdminApi'

interface PeoplePanelProps {
    token: string
    kind: PeopleKind
    page: number
    search: string
    onPageChange: (page: number) => void
    onSearchChange: (search: string) => void
}

/**
 * O'quvchi, o'qituvchi va administrator — bitta jadval.
 *
 * Uchalasida ham ko'rsatiladigan narsa bir xil (ism, telefon, tug'ilgan
 * sana), faqat manba boshqa. Uchta alohida komponent yozilsa uchta joyda
 * bir xil tuzatish qilishga to'g'ri kelardi.
 *
 * Bu yerda faqat KO'RISH bor: qo'shish va tahrirlash administrator
 * panelida, chunki kundalik ish o'sha yerda qilinadi.
 */
export function PeoplePanel({
    token,
    kind,
    page,
    search,
    onPageChange,
    onSearchChange,
}: PeoplePanelProps) {
    const { t } = useT()
    const { rows, totalPages, totalElements, isLoading, error } = usePeople(
        token,
        kind,
        page,
        search
    )

    const columns = [
        {
            key: 'fullName',
            label: t('field.fullName'),
            render: (row: PersonRow) => (
                <div className="flex items-center gap-2.5">
                    <Avatar
                        name={row.userDto?.fullName}
                        src={row.userDto?.imageUrl}
                        size="sm"
                        fallback="silhouette"
                    />
                    <span className="font-medium text-fg">{row.userDto?.fullName || '—'}</span>
                </div>
            ),
        },
        {
            key: 'phone',
            label: t('field.phone'),
            render: (row: PersonRow) => (
                <span className="font-mono text-sm">{row.userDto?.phone || '—'}</span>
            ),
        },
        {
            key: 'birthDate',
            label: t('field.birthDate'),
            render: (row: PersonRow) => row.userDto?.birthDate || '—',
        },
    ]

    return (
        <Panel>
            <div className="mb-3 max-w-xs">
                <Input
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={t('superAdmin.search')}
                />
            </div>

            {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

            <SimpleTable
                rows={rows}
                columns={columns}
                isLoading={isLoading}
                emptyText={t('superAdmin.peopleEmpty')}
            />

            <Pagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                onPageChange={onPageChange}
            />
        </Panel>
    )
}
