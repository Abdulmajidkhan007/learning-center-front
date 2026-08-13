import { useT } from '@/shared/i18n'
import { formatDate } from '@/shared/lib'
import { Button, IconButton, TrashIcon } from '@/shared/ui'
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

    return (
        <div className="mb-4 overflow-x-auto rounded-lg border border-border-base">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr>
                        {[
                            t('invoice.number'),
                            t('invoice.student'),
                            t('invoice.amount'),
                            t('invoice.issuedAt'),
                            t('field.status'),
                        ].map((label) => (
                            <th
                                key={label}
                                className="border-b border-border-base bg-surface px-4 py-2.5 text-left font-mono text-[0.66rem] tracking-[0.05em] whitespace-nowrap text-fg-faint uppercase"
                            >
                                {label}
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
                            <td colSpan={6} className="px-4 py-8 text-center text-fg-faint">
                                {t('common.loading')}
                            </td>
                        </tr>
                    )}

                    {!isLoading && invoices.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-fg-faint">
                                {t('invoice.empty')}
                            </td>
                        </tr>
                    )}

                    {!isLoading &&
                        invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-surface-hover">
                                <td className="border-b border-border-base px-4 py-3 font-mono text-xs whitespace-nowrap text-fg-muted">
                                    {invoice.invoiceNumber ?? '—'}
                                </td>
                                <td className="border-b border-border-base px-4 py-3 whitespace-nowrap text-fg">
                                    {invoice.student?.userDto?.fullName ?? '—'}
                                </td>
                                <td className="border-b border-border-base px-4 py-3 text-right tabular-nums whitespace-nowrap text-fg">
                                    {formatAmount(invoice.amount)}
                                </td>
                                <td className="border-b border-border-base px-4 py-3 tabular-nums whitespace-nowrap text-fg-muted">
                                    {formatDate(invoice.issuedAt) || '—'}
                                </td>
                                <td className="border-b border-border-base px-4 py-3 whitespace-nowrap">
                                    <InvoiceStatusBadge status={invoice.status} />
                                </td>
                                <td className="border-b border-border-base px-4 py-3 text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-2">
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
                                        <IconButton
                                            label={t('common.delete')}
                                            tone="danger"
                                            onClick={() => onDelete(invoice)}
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
