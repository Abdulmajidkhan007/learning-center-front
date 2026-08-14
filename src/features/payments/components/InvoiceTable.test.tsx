import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { InvoiceTable } from './InvoiceTable'
import type { InvoiceDto } from '@/shared/types'

const pending: InvoiceDto = {
    id: 'i1',
    invoiceNumber: 'INV-002',
    student: { id: 's1', userDto: { fullName: 'Aziza Karimova' } },
    amount: 450000,
    issuedAt: '2026-08-01T09:00:00',
    status: 'PENDING',
}

const paid: InvoiceDto = { ...pending, id: 'i2', invoiceNumber: 'INV-001', status: 'PAID' }

function renderTable(invoices: InvoiceDto[], handlers: { onMarkPaid?: () => void; onRefund?: () => void } = {}) {
    const onMarkPaid = handlers.onMarkPaid ?? vi.fn()
    const onRefund = handlers.onRefund ?? vi.fn()
    renderWithProviders(
        <InvoiceTable
            invoices={invoices}
            isLoading={false}
            onMarkPaid={onMarkPaid}
            onDelete={vi.fn()}
            onRefund={onRefund}
            isRefunding={false}
        />
    )
    return { onMarkPaid, onRefund }
}

describe('InvoiceTable', () => {
    it('o’quvchi ismini va summasini ko’rsatadi', () => {
        renderTable([pending])
        expect(screen.getByText('Aziza Karimova')).toBeInTheDocument()
        expect(screen.getByText(/450/)).toBeInTheDocument()
    })

    // To'langan hisobni qayta "to'landi" qilishning ma'nosi yo'q va bu
    // tasodifan bosishga olib keladi.
    it('to’langan hisobda "to’landi" tugmasi bo’lmaydi', () => {
        renderTable([paid])
        expect(screen.queryByRole('button', { name: /to‘landi/i })).not.toBeInTheDocument()
    })

    it('kutilayotgan hisobda tugma bosilsa hisobni uzatadi', async () => {
        const { onMarkPaid } = renderTable([pending])
        await userEvent.click(screen.getByRole('button', { name: /to‘landi/i }))
        expect(onMarkPaid).toHaveBeenCalledWith(pending)
    })

    // Qaytarish faqat to'langan puldan ma'noga ega.
    it('to’lanmagan hisobda "qaytarish" tugmasi bo’lmaydi', () => {
        renderTable([pending])
        expect(screen.queryByRole('button', { name: /qaytarish/i })).not.toBeInTheDocument()
    })

    it('to’langan hisobda qaytarish tugmasi hisobni uzatadi', async () => {
        const { onRefund } = renderTable([paid])
        await userEvent.click(screen.getByRole('button', { name: /qaytarish/i }))
        expect(onRefund).toHaveBeenCalledWith(paid)
    })

    it('ro’yxat bo’sh bo’lsa tushunarli xabar chiqadi', () => {
        renderTable([])
        expect(screen.getByText(/hisob topilmadi/i)).toBeInTheDocument()
    })
})
