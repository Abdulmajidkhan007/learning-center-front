import { useT } from '@/shared/i18n'
import { formatAmount, formatDate } from '@/shared/lib'
import { DataTable, IconButton, TrashIcon } from '@/shared/ui'
import type { DataTableColumn, SelectOption } from '@/shared/ui'
import type { InvoiceDto } from '@/shared/types'

interface InvoiceTableProps {
    invoices: InvoiceDto[]
    isLoading: boolean
    /**
     * O'quvchilar ro'yxati — `InvoiceDto` da faqat `studentId` bor, ism yo'q.
     * Ismni shu ro'yxatdan topamiz.
     */
    studentOptions: SelectOption[]
    onDelete: (invoice: InvoiceDto) => void
}

export function InvoiceTable({ invoices, isLoading, studentOptions, onDelete }: InvoiceTableProps) {
    const { t } = useT()

    const nameById = new Map(studentOptions.map((option) => [option.value, option.label]))

    const columns: DataTableColumn<InvoiceDto>[] = [
        {
            key: 'invoiceNumber',
            header: t('invoice.number'),
            className: 'font-mono text-xs text-fg-muted',
            render: (invoice) => invoice.invoiceNumber ?? '—',
        },
        {
            key: 'student',
            header: t('invoice.student'),
            render: (invoice) => {
                const studentId = invoice.enrollmentDto?.studentId
                if (!studentId) return '—'
                // Ro'yxat hali yuklanmagan bo'lsa id ko'rsatiladi — bo'sh
                // katakdan ko'ra id foydaliroq, hech bo'lmasa qidirsa bo'ladi.
                return nameById.get(studentId) ?? studentId
            },
        },
        {
            key: 'amount',
            header: t('invoice.amount'),
            align: 'right',
            className: 'tabular-nums',
            render: (invoice) => formatAmount(invoice.amount),
        },
        {
            key: 'issuedAt',
            header: t('invoice.issuedAt'),
            render: (invoice) => formatDate(invoice.issuedAt) || '—',
        },
    ]

    return (
        <DataTable
            rows={invoices}
            columns={columns}
            isLoading={isLoading}
            loadingText={t('common.loading')}
            emptyText={t('invoice.empty')}
            getRowKey={(invoice) => invoice.id}
            actionsHeader={t('admin.actions')}
            renderActions={(invoice) => (
                <IconButton label={t('common.delete')} tone="danger" onClick={() => onDelete(invoice)}>
                    <TrashIcon />
                </IconButton>
            )}
        />
    )
}
