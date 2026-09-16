import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { PaymentReceiptModal } from './PaymentReceiptModal'
import type { TransactionDto } from '@/shared/types'

vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({
        token: 'test-token',
        role: 'ADMINISTRATOR',
        claims: { organizationId: 'org-123' },
    }),
}))

const useMyOrganizationMock = vi.fn()
vi.mock('@/shared/hooks', async () => {
    const actual = await vi.importActual('@/shared/hooks')
    return {
        ...actual,
        useMyOrganization: (...args: unknown[]) => useMyOrganizationMock(...args),
    }
})

const mockTransaction: TransactionDto = {
    id: 'tx-123',
    type: 'PAID',
    amount: 550000,
    createdAt: '2026-03-01T10:00:00',
    user: {
        id: 'st-1',
        balance: 150000,
        userDto: {
            fullName: 'Jasur Alimov',
        },
    },
    invoice: {
        id: 'inv-1',
        invoiceNumber: 'INV-101',
        enrollmentDto: {
            id: 'en-1',
            groupId: 'GRP-99',
            studentFullName: 'Jasur Alimov',
        },
    },
}

describe('PaymentReceiptModal', () => {
    it('tashkilot nomi yuklanganda haqiqiy markaz nomini ko‘rsatadi', () => {
        useMyOrganizationMock.mockReturnValue({
            data: { id: 'org-123', name: 'Alia Education Center' },
        })

        renderWithProviders(<PaymentReceiptModal transaction={mockTransaction} onClose={vi.fn()} />)

        expect(screen.getByText('Alia Education Center')).toBeInTheDocument()
    })

    it('tashkilot nomi yuklanmaganda fallback matn ko‘rsatiladi va sarlavha bo‘sh qolmaydi', () => {
        useMyOrganizationMock.mockReturnValue({
            data: undefined,
        })

        renderWithProviders(<PaymentReceiptModal transaction={mockTransaction} onClose={vi.fn()} />)

        expect(screen.getByText(/O'QUV MARKAZI|O‘QUV MARKAZI/i)).toBeInTheDocument()
    })

    it('o‘quvchi ismi, guruh, summa, sana, to‘lov turi va balansni ko‘rsatadi', () => {
        useMyOrganizationMock.mockReturnValue({
            data: { id: 'org-123', name: 'Alia Education Center' },
        })
        renderWithProviders(<PaymentReceiptModal transaction={mockTransaction} onClose={vi.fn()} />)

        expect(screen.getByText('Jasur Alimov')).toBeInTheDocument()
        expect(screen.getByText('GRP-99')).toBeInTheDocument()
        expect(screen.getByText('550 000')).toBeInTheDocument()
        expect(screen.getByText('2026-03-01')).toBeInTheDocument()
        expect(screen.getByText('150 000')).toBeInTheDocument()
        expect(screen.getByText(/to‘ladi/i)).toBeInTheDocument()
    })

    it('chop etish tugmasi bosilganda window.print chaqiriladi', async () => {
        const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})

        renderWithProviders(<PaymentReceiptModal transaction={mockTransaction} onClose={vi.fn()} />)

        const printButton = screen.getByRole('button', { name: /chop etish/i })
        await userEvent.click(printButton)

        expect(printSpy).toHaveBeenCalledTimes(1)
        printSpy.mockRestore()
    })

    it('yopish tugmasi bosilganda onClose chaqiriladi', async () => {
        const onClose = vi.fn()
        renderWithProviders(<PaymentReceiptModal transaction={mockTransaction} onClose={onClose} />)

        const closeButton = screen.getByRole('button', { name: /yopish/i })
        await userEvent.click(closeButton)

        expect(onClose).toHaveBeenCalledTimes(1)
    })
})
