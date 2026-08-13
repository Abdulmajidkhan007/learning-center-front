import { useT } from '@/shared/i18n'
import { formatCell, formatHeader } from '@/shared/lib'
import { EditIcon, IconButton, TrashIcon, UserPlusIcon } from '@/shared/ui'
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

    return (
        <div className="mb-4 overflow-x-auto rounded-lg border border-border-base">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr>
                        {columns.map((key) => (
                            <th
                                key={key}
                                className="border-b border-border-base bg-surface px-4 py-2.5 text-left font-mono text-[0.66rem] tracking-[0.05em] whitespace-nowrap text-fg-faint uppercase"
                            >
                                {headerLabel(key)}
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
                            <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-fg-faint">
                                {t('common.loading')}
                            </td>
                        </tr>
                    )}

                    {!isLoading && rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-fg-faint">
                                {t('admin.notFound', { entity: entityLabel })}
                            </td>
                        </tr>
                    )}

                    {!isLoading &&
                        rows.map((row) => (
                            <tr key={row.id} className="hover:bg-surface-hover">
                                {columns.map((key) => (
                                    <td
                                        key={key}
                                        className="border-b border-border-base px-4 py-3 whitespace-nowrap text-fg"
                                    >
                                        {renderCell(row, key)}
                                    </td>
                                ))}
                                <td className="border-b border-border-base px-4 py-3 text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-2">
                                        {onAssignStudents && (
                                            <IconButton
                                                label={t('admin.addStudents')}
                                                onClick={() => onAssignStudents(row)}
                                            >
                                                <UserPlusIcon />
                                            </IconButton>
                                        )}
                                        <IconButton label={t('common.edit')} onClick={() => onEdit(row)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            label={t('common.delete')}
                                            tone="danger"
                                            onClick={() => onDelete(row)}
                                        >
                                            <TrashIcon />
                                        </IconButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
