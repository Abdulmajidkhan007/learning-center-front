import type { ReactNode } from 'react'
import { useT } from '@/shared/i18n'
import { DataTable, EditIcon, IconButton, TrashIcon } from '@/shared/ui'
import type { DataTableColumn } from '@/shared/ui'

export interface SimpleColumn<T> {
    key: string
    label: string
    render: (row: T) => ReactNode
}

interface SimpleTableProps<T> {
    rows: T[]
    columns: SimpleColumn<T>[]
    isLoading: boolean
    emptyText: string
    onEdit: (row: T) => void
    /** Berilmasa o'chirish tugmasi umuman ko'rsatilmaydi. */
    onDelete?: (row: T) => void
}

/**
 * Super-admin paneli uchun oddiy jadval.
 *
 * Admin'dagi `EntityTable` ishlatilmadi: u `AdminRow` ga va generik
 * konfiguratsiyaga bog'langan, bo'limlar esa bir-biridan import qilmaydi.
 * Bu yerda ustunlar shunchaki funksiya bo'lgani uchun ancha soddaroq.
 */
export function SimpleTable<T extends { id: string }>({
    rows,
    columns,
    isLoading,
    emptyText,
    onEdit,
    onDelete,
}: SimpleTableProps<T>) {
    const { t } = useT()
    const tableColumns: DataTableColumn<T>[] = columns.map((column) => ({
        key: column.key,
        header: column.label,
        render: column.render,
    }))

    return (
        <DataTable
            rows={rows}
            columns={tableColumns}
            isLoading={isLoading}
            loadingText={t('common.loading')}
            emptyText={emptyText}
            getRowKey={(row) => row.id}
            actionsHeader={t('admin.actions')}
            renderActions={(row) => (
                <>
                    <IconButton label={t('common.edit')} onClick={() => onEdit(row)}>
                        <EditIcon />
                    </IconButton>
                    {onDelete && (
                        <IconButton label={t('common.delete')} tone="danger" onClick={() => onDelete(row)}>
                            <TrashIcon />
                        </IconButton>
                    )}
                </>
            )}
        />
    )
}
