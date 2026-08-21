import { useT } from '@/shared/i18n'
import { formatCell, formatHeader } from '@/shared/lib'
import { DataTable, EditIcon, IconButton, TrashIcon, UserPlusIcon } from '@/shared/ui'
import type { DataTableColumn } from '@/shared/ui'
import type { ColumnConfig } from '../config/columns'
import type { AdminRow } from '../types'

interface EntityTableProps {
    rows: AdminRow[]
    /** Ko'rsatiladigan ustun kalitlari (konfiguratsiyadan yoki avtomatik). */
    columns: string[]
    columnConfigs?: ColumnConfig[]
    isLoading: boolean
    /** "… topilmadi" xabarida ishlatiladigan bo'lim nomi. */
    entityLabel: string
    /** Faqat guruhlar tabida — o'quvchi biriktirish tugmasi. */
    onAssignStudents?: (row: AdminRow) => void
    onEdit: (row: AdminRow) => void
    onDelete: (row: AdminRow) => void
}

export function EntityTable({
    rows,
    columns,
    columnConfigs,
    isLoading,
    entityLabel,
    onAssignStudents,
    onEdit,
    onDelete,
}: EntityTableProps) {
    const { t } = useT()

    function headerLabel(key: string) {
        const config = columnConfigs?.find((column) => column.key === key)
        // Konfiguratsiyasiz rejimda tarjima yo'q — kalitning o'zi ko'rsatiladi.
        return config ? t(config.labelKey) : formatHeader(key)
    }

    function renderCell(row: AdminRow, key: string) {
        const config = columnConfigs?.find((column) => column.key === key)
        if (config?.render) return config.render(row)
        return formatCell(config?.get ? config.get(row) : row[key])
    }

    const tableColumns: DataTableColumn<AdminRow>[] = columns.map((key) => ({
        key,
        header: headerLabel(key),
        render: (row) => renderCell(row, key),
    }))

    return (
        <DataTable
            rows={rows}
            columns={tableColumns}
            isLoading={isLoading}
            loadingText={t('common.loading')}
            emptyText={t('admin.notFound', { entity: entityLabel })}
            getRowKey={(row) => row.id}
            actionsHeader={t('admin.actions')}
            renderActions={(row) => (
                <>
                    {onAssignStudents && (
                        <IconButton label={t('admin.addStudents')} onClick={() => onAssignStudents(row)}>
                            <UserPlusIcon />
                        </IconButton>
                    )}
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
