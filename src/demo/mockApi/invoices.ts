import type { TransactionDto, TransactionType } from '@/shared/types'
import { db, json, nextId, noContent, page, type Row } from './state'

/**
 * Hisoblar va to'lovlar.
 *
 * Haqiqiy backendda hisob 12-darsdan keyin AVTOMATIK yaratiladi va uni
 * mijoz tomondan yaratib bo'lmaydi — shuning uchun bu yerda ham `POST
 * /invoice` yo'q. To'lov esa `POST /transaction` orqali yoziladi.
 */
export function handleInvoices(
    path: string,
    method: string,
    url: URL,
    body: Record<string, unknown>
): Response | null {
    if (path === '/invoice' && method === 'GET') {
        // Holat filtri: `InvoiceDto` da `status` yo'q, u faqat server tomonda
        // tekshiriladi — demo'da esa tekshiradigan narsa yo'q, hammasi qaytadi.
        return page(db.invoices as unknown as Row[], url)
    }
    if (path.startsWith('/invoice/') && method === 'DELETE') {
        const id = path.split('/')[2]
        db.invoices = db.invoices.filter((invoice) => invoice.id !== id)
        return noContent()
    }

    if (path === '/transaction' && method === 'GET') {
        return page(db.transactions as unknown as Row[], url)
    }
    if (path === '/transaction' && method === 'POST') {
        const studentId = String(body.studentId ?? '')
        const student = db.students.find((item) => item.id === studentId)
        // Backend to'lovni o'quvchining eng so'nggi hisobiga bog'laydi.
        const invoice = [...db.invoices]
            .reverse()
            .find((item) => item.enrollmentDto?.studentId === studentId)
        if (!invoice) return json({ message: 'Invoice not found' }, 404)

        const transaction: TransactionDto = {
            id: nextId('t'),
            type: body.type as TransactionType,
            amount: Number(body.amount),
            invoice,
            user: student,
            createdAt: new Date().toISOString().slice(0, 19),
        }
        db.transactions = [transaction, ...db.transactions]
        return json(transaction)
    }
    if (path.startsWith('/transaction/') && method === 'DELETE') {
        const id = path.split('/')[2]
        db.transactions = db.transactions.filter((transaction) => transaction.id !== id)
        return noContent()
    }

    return null
}
