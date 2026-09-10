import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { InvoiceTable } from './InvoiceTable'
import type { InvoiceDto } from '@/shared/types'

const invoices: InvoiceDto[] = [
    {
        id: 'i1',
        invoiceNumber: 'INV-001',
        amount: 450000,
        issuedAt: '2026-07-01T09:00:00',
        enrollmentDto: { id: 'e1', studentId: 'st-1' },
    },
]

const studentOptions = [{ value: 'st-1', label: 'Aziza Karimova' }]

describe('InvoiceTable', () => {
    // `InvoiceDto` da o'quvchi ismi yo'q — u faqat `studentId` bo'yicha topiladi.
    it('o‘quvchi ismini id bo‘yicha ro‘yxatdan topadi', () => {
        renderWithProviders(
            <InvoiceTable invoices={invoices} isLoading={false} studentOptions={studentOptions} onDelete={vi.fn()} />
        )

        const row = screen.getByRole('row', { name: /INV-001/ })
        expect(within(row).getByText('Aziza Karimova')).toBeInTheDocument()
    })

    // Ro'yxat hali yuklanmagan bo'lsa bo'sh katakdan ko'ra id foydaliroq.
    it('ro‘yxat bo‘sh bo‘lsa id ko‘rsatadi', () => {
        renderWithProviders(
            <InvoiceTable invoices={invoices} isLoading={false} studentOptions={[]} onDelete={vi.fn()} />
        )

        const row = screen.getByRole('row', { name: /INV-001/ })
        expect(within(row).getByText('st-1')).toBeInTheDocument()
    })
})
