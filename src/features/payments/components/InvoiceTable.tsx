import { useT } from '@/shared/i18n'
import { formatDate } from '@/shared/lib'
import { Button, DataTable, IconButton, TrashIcon } from '@/shared/ui'
import type { DataTableColumn } from '@/shared/ui'
import { formatAmount } from '../lib/format'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import type { InvoiceDto } from '@/shared/types'

interface InvoiceTableProps {
    invoices: InvoiceDto[]
    isLoading: boolean
    /** Holat o'zgartirilayotgan hisob — tugmalar shu qatorda o'chiriladi. */
    pendingId?: string
    onMarkPaid: (invoice: InvoiceDto) => void
    onDelete: (invoice: InvoiceDto) => void
}

export function InvoiceTable({
    invoices,
    isLoading,
    pendingId,
    onMarkPaid,
    onDelete,
}: InvoiceTableProps) {
    const { t } = useT()

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
            render: (invoice) => invoice.student?.userDto?.fullName ?? '—',
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
            className: 'tabular-nums text-fg-muted',
            render: (invoice) => formatDate(invoice.issuedAt) || '—',
        },
        {
            key: 'type',
            header: t('invoice.type'),
            className: 'font-mono text-xs text-fg-muted',
            // Turi serverdan kelgan enum nomi bilan ko'rsatiladi: qiymatlari hali aytilmagan,
            // taxminiy tarjima esa yolg'on bo'lardi.
            render: (invoice) => invoice.type || '—',
        },
        {
            key: 'status',
            header: t('field.status'),
            render: (invoice) => <InvoiceStatusBadge status={invoice.status} />,
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
                <>
                    {invoice.status !== 'PAID' && (
                        <Button
                            variant="success"
                            size="sm"
                            disabled={pendingId === invoice.id}
                            onClick={() => onMarkPaid(invoice)}
                        >
                            {t('invoice.markPaid')}
                        </Button>
                    )}
                    <IconButton label={t('common.delete')} tone="danger" onClick={() => onDelete(invoice)}>
                        <TrashIcon />
                    </IconButton>
                </>
            )}
        />
    )
}
