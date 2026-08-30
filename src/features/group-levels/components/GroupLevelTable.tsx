import { useT } from '@/shared/i18n'
import { DataTable, EditIcon, IconButton, TrashIcon } from '@/shared/ui'
import type { DataTableColumn } from '@/shared/ui'
import type { GroupLevelDto } from '@/shared/types'

interface GroupLevelTableProps {
    rows: GroupLevelDto[]
    isLoading: boolean
    onEdit: (row: GroupLevelDto) => void
    onDelete: (row: GroupLevelDto) => void
}

export function GroupLevelTable({ rows, isLoading, onEdit, onDelete }: GroupLevelTableProps) {
    const { t } = useT()

    const columns: DataTableColumn<GroupLevelDto>[] = [
        { key: 'name', header: t('groupLevel.name'), render: (row) => row.name },
        { key: 'lessonCount', header: t('groupLevel.lessonCount'), render: (row) => String(row.lessonCount ?? '') },
        { key: 'orderNumber', header: t('groupLevel.orderNumber'), render: (row) => String(row.orderNumber ?? '') },
        { key: 'durationInMonths', header: t('groupLevel.durationInMonths'), render: (row) => String(row.durationInMonths ?? '') },
    ]

    return (
        <DataTable
            rows={rows}
            columns={columns}
            isLoading={isLoading}
            loadingText={t('common.loading')}
            emptyText={t('groupLevel.empty')}
            getRowKey={(row) => row.id}
            actionsHeader={t('admin.actions')}
            renderActions={(row) => (
                <>
                    <IconButton label={t('common.edit')} onClick={() => onEdit(row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton label={t('common.delete')} tone="danger" onClick={() => onDelete(row)}>
                        <TrashIcon />
                    </IconButton>
                </>
            )}
        />
    )
}
