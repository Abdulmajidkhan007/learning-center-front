import type { InvoiceDto, InvoiceStatus } from '@/shared/types'
import { db, json, nextId, noContent, page, type Row } from './state'

export function handleInvoices(
    path: string,
    method: string,
    url: URL,
    body: Record<string, unknown>
): Response | null {
    if (path === '/invoice' && method === 'GET') {
        const status = url.searchParams.get('status')
        const rows = status
            ? db.invoices.filter((invoice) => invoice.status === status)
            : db.invoices
        return page(rows as unknown as Row[], url)
    }
    if (path === '/invoice' && method === 'POST') {
        const student = db.students.find((item) => item.id === String(body.studentId))
        const invoice: InvoiceDto = {
            id: nextId('i'),
            invoiceNumber: `INV-${String(db.invoices.length + 1).padStart(3, '0')}`,
            student,
            amount: Number(body.amount),
            issuedAt: new Date().toISOString().slice(0, 19),
            // Backend ham shunday qiladi: yangi hisob doim kutilmoqda.
            status: 'PENDING',
        }
        db.invoices = [...db.invoices, invoice]
        return json(invoice)
    }
    if (path === '/invoice/return' && method === 'POST') {
        // Haqiqiy backend o'tilgan darslar pulini ushlab qoladi; demo'da
        // shunchaki oxirgi to'lovning yarmini qaytargan bo'lamiz.
        const studentId = url.searchParams.get('studentId') ?? ''
        const paid = db.invoices.find(
            (item) => item.student?.id === studentId && item.status === 'PAID'
        )
        const refundRecord: InvoiceDto = {
            id: nextId('i'),
            invoiceNumber: `RET-${String(db.invoices.length + 1).padStart(3, '0')}`,
            student: paid?.student,
            amount: Math.round((paid?.amount ?? 0) / 2),
            issuedAt: new Date().toISOString().slice(0, 19),
            status: 'PAID',
            type: 'RETURN',
        }
        db.invoices = [...db.invoices, refundRecord]
        return json(refundRecord)
    }
    if (path.startsWith('/invoice/') && method === 'PUT') {
        const id = path.split('/')[2]
        db.invoices = db.invoices.map((invoice) =>
            invoice.id === id ? { ...invoice, status: body.status as InvoiceStatus } : invoice
        )
        return json(db.invoices.find((invoice) => invoice.id === id))
    }
    if (path.startsWith('/invoice/') && method === 'DELETE') {
        const id = path.split('/')[2]
        db.invoices = db.invoices.filter((invoice) => invoice.id !== id)
        return noContent()
    }

    return null
}
