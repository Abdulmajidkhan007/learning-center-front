import type { PaymentsKeys } from '../uz/payments'

/** To'lovlar bo'limi. (inglizcha) */
export const payments: Record<PaymentsKeys, string> = {
    'invoice.title': 'Payments',
    'invoice.eyebrow': 'Invoices',
    'invoice.number': 'Invoice no.',
    'invoice.student': 'Student',
    'invoice.amount': 'Amount',
    'invoice.issuedAt': 'Issued',
    'invoice.new': '+ New invoice',
    'invoice.newTitle': 'New invoice',
    'invoice.createHint':
        'The invoice is created as pending. Mark it paid once the money arrives.',
    'invoice.type': 'Type',
    'invoice.refund': 'Refund',
    'invoice.refundFor': 'Refund to',
    'invoice.refundHint': 'The server works out the amount: lessons already held are deducted and the rest is returned.',
    'invoice.refundConfirm': 'Refund {{name}}? The server works out the amount: lessons already held are deducted and the rest is returned.',
    'invoice.refundDone': 'Refunded: {{amount}} ({{number}}).',
    'invoice.markPaid': 'Mark paid',
    'invoice.search': 'number, name or phone…',
    'invoice.from': 'From',
    'invoice.to': 'To',
    'invoice.clearDates': 'Clear dates',
    'invoice.allStatuses': 'All statuses',
    'invoice.empty': 'No invoices found',
    'invoice.loadFailed': 'Could not load payments: {{message}}',
    'invoice.deleteConfirm': 'Delete invoice {{number}}? This cannot be undone.',
    'invoice.status.PAID': 'Paid',
    'invoice.status.PENDING': 'Pending',
    'invoice.status.OVERDUE': 'Overdue',
}
