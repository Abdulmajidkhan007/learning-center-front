import { useT } from '@/shared/i18n'
import { formatAmount, formatDate } from '@/shared/lib'
import { Button, DataTable } from '@/shared/ui'
import type { DataTableColumn } from '@/shared/ui'
import { SubscriptionStatusBadge } from './SubscriptionStatusBadge'
import type { SubscriptionDto } from '@/shared/types'

interface SubscriptionTableProps {
    subscriptions: SubscriptionDto[]
    isLoading: boolean
    onCancel: (subscription: SubscriptionDto) => void
}

export function SubscriptionTable({ subscriptions, isLoading, onCancel }: SubscriptionTableProps) {
    const { t } = useT()

    const columns: DataTableColumn<SubscriptionDto>[] = [
        {
            key: 'organization',
            header: t('subscription.organization'),
            render: (row) => row.organization?.name ?? '—',
        },
        { key: 'plan', header: t('subscription.plan'), render: (row) => row.plan?.name ?? '—' },
        {
            key: 'status',
            header: t('subscription.status'),
            render: (row) => <SubscriptionStatusBadge status={row.status} />,
        },
        {
            key: 'startsAt',
            header: t('subscription.startsAt'),
            render: (row) => formatDate(row.startsAt) || '—',
        },
        {
            key: 'expiresAt',
            header: t('subscription.expiresAt'),
            render: (row) => formatDate(row.expiresAt) || '—',
        },
        {
            key: 'paidAmount',
            header: t('subscription.paidAmount'),
            align: 'right',
            render: (row) => <span className="tabular-nums">{formatAmount(row.paidAmount)}</span>,
        },
        {
            key: 'note',
            header: t('subscription.note'),
            // Izoh — o'tkazma haqidagi erkin matn, uzun bo'lishi mumkin.
            render: (row) => <span className="text-fg-muted">{row.note || '—'}</span>,
        },
    ]

    return (
        <DataTable
            rows={subscriptions}
            columns={columns}
            isLoading={isLoading}
            loadingText={t('common.loading')}
            emptyText={t('subscription.empty')}
            getRowKey={(row) => row.id}
            actionsHeader={t('admin.actions')}
            renderActions={(row) =>
                // Bekor qilingan yoki muddati tugaganini qayta bekor qilishning
                // ma'nosi yo'q — tugma faqat amaldagilarda ko'rinadi.
                row.status === 'ACTIVE' || row.status === 'GRACE' ? (
                    <div className="flex justify-end">
                        <Button size="sm" onClick={() => onCancel(row)}>
                            {t('common.cancel')}
                        </Button>
                    </div>
                ) : null
            }
        />
    )
}
