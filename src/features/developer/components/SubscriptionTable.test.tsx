import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { SubscriptionTable } from './SubscriptionTable'
import type { SubscriptionDto } from '@/shared/types'

const rows: SubscriptionDto[] = [
    {
        id: 's-1',
        organization: { id: 'o-1', name: 'Alia markazi' },
        plan: { id: 'p-1', name: 'Standard' },
        status: 'ACTIVE',
        startsAt: '2026-09-01T00:00:00Z',
        expiresAt: '2026-10-01T00:00:00Z',
        paidAmount: 450000,
        note: 'Humo, JB-7K2M',
    },
    {
        id: 's-2',
        organization: { id: 'o-2', name: 'Bilim markazi' },
        plan: { id: 'p-1', name: 'Standard' },
        status: 'EXPIRED',
        paidAmount: 450000,
    },
]

describe('SubscriptionTable', () => {
    it('tashkilot, tarif va holatni ko’rsatadi', () => {
        renderWithProviders(
            <SubscriptionTable subscriptions={rows} isLoading={false} onCancel={vi.fn()} />
        )

        expect(screen.getByText('Alia markazi')).toBeInTheDocument()
        expect(screen.getByText('Humo, JB-7K2M')).toBeInTheDocument()
        expect(screen.getByText(/faol/i)).toBeInTheDocument()
        expect(screen.getByText(/muddati tugagan/i)).toBeInTheDocument()
    })

    /*
     * Muddati tugagan obunani "bekor qilish" ma'nosiz — u allaqachon
     * ishlamayapti. Tugma faqat haqiqatan to'xtatsa bo'ladigan qatorda
     * turishi kerak, aks holda dasturchi nima o'zgarganini tushunmaydi.
     */
    it('faqat amaldagi obunada bekor qilish tugmasi bo’ladi', async () => {
        const user = userEvent.setup()
        const onCancel = vi.fn()

        renderWithProviders(
            <SubscriptionTable subscriptions={rows} isLoading={false} onCancel={onCancel} />
        )

        const buttons = screen.getAllByRole('button', { name: /bekor qilish/i })
        expect(buttons).toHaveLength(1)

        await user.click(buttons[0])
        expect(onCancel).toHaveBeenCalledWith(expect.objectContaining({ id: 's-1' }))
    })
})
