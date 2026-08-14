import type { ReactNode } from 'react'
import { useT } from '@/shared/i18n'
import { EditIcon, IconButton, TrashIcon } from '@/shared/ui'

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
    const colSpan = columns.length + 1

    return (
        <div className="mb-4 overflow-x-auto rounded-lg border border-border-base">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="border-b border-border-base bg-surface px-4 py-2.5 text-left font-mono text-[0.66rem] tracking-[0.05em] whitespace-nowrap text-fg-faint uppercase"
                            >
                                {column.label}
                            </th>
                        ))}
                        <th className="border-b border-border-base bg-surface px-4 py-2.5 text-right font-mono text-[0.66rem] tracking-[0.05em] whitespace-nowrap text-fg-faint uppercase">
                            {t('admin.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={colSpan} className="px-4 py-8 text-center text-fg-faint">
                                {t('common.loading')}
                            </td>
                        </tr>
                    )}

                    {!isLoading && rows.length === 0 && (
                        <tr>
                            <td colSpan={colSpan} className="px-4 py-8 text-center text-fg-faint">
                                {emptyText}
                            </td>
                        </tr>
                    )}

                    {!isLoading &&
                        rows.map((row) => (
                            <tr key={row.id} className="hover:bg-surface-hover">
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="border-b border-border-base px-4 py-3 whitespace-nowrap text-fg"
                                    >
                                        {column.render(row)}
                                    </td>
                                ))}
                                <td className="border-b border-border-base px-4 py-3 text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-2">
                                        <IconButton label={t('common.edit')} onClick={() => onEdit(row)}>
                                            <EditIcon />
                                        </IconButton>
                                        {onDelete && (
                                            <IconButton
                                                label={t('common.delete')}
                                                tone="danger"
                                                onClick={() => onDelete(row)}
                                            >
                                                <TrashIcon />
                                            </IconButton>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
