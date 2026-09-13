import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { TransactionTable } from './TransactionTable'
import type { TransactionDto } from '@/shared/types'

const mockTransactions: TransactionDto[] = [
    {
        id: 'tx-1',
        type: 'PAID',
        amount: 300000,
        createdAt: '2026-03-01T12:00:00',
        user: {
            id: 'st-1',
            userDto: { fullName: 'Vali Rahimov' },
            balance: 50000,
        },
        invoice: {
            id: 'inv-1',
            invoiceNumber: 'INV-001',
        },
    },
]

describe('TransactionTable', () => {
    it('tranzaksiya ma‘lumotlarini ko‘rsatadi', () => {
        renderWithProviders(
            <TransactionTable transactions={mockTransactions} isLoading={false} onDelete={vi.fn()} />
        )

        expect(screen.getByText('Vali Rahimov')).toBeInTheDocument()
        expect(screen.getByText('300 000')).toBeInTheDocument()
        expect(screen.getByText('INV-001')).toBeInTheDocument()
    })

    it('onPrint uzatilganda chop etish tugmasi ko‘rinadi va bosilganda chaqiriladi', async () => {
        const onPrint = vi.fn()
        renderWithProviders(
            <TransactionTable
                transactions={mockTransactions}
                isLoading={false}
                onDelete={vi.fn()}
                onPrint={onPrint}
            />
        )

        const printButton = screen.getByRole('button', { name: /chop etish/i })
        expect(printButton).toBeInTheDocument()

        await userEvent.click(printButton)
        expect(onPrint).toHaveBeenCalledWith(mockTransactions[0])
    })
})
