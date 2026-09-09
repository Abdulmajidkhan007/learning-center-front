import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ApiError } from '@/shared/api'
import { GroupInvoicePanel } from './GroupInvoicePanel'

const groupOptions = [{ value: 'g1', label: 'ENG 352' }]

function render(props: Partial<Parameters<typeof GroupInvoicePanel>[0]> = {}) {
    const onCreate = vi.fn()
    renderWithProviders(
        <GroupInvoicePanel
            groupOptions={groupOptions}
            isPending={false}
            isSuccess={false}
            error={null}
            onCreate={onCreate}
            {...props}
        />
    )
    return onCreate
}

describe('GroupInvoicePanel', () => {
    it('guruh tanlanmaguncha tugma o‘chiq', () => {
        render()
        expect(screen.getByRole('button', { name: /hisob yaratish/i })).toBeDisabled()
    })

    it('guruh tanlansa o‘sha id bilan chaqiradi', async () => {
        const onCreate = render()

        await userEvent.selectOptions(screen.getByLabelText(/guruh/i), 'g1')
        await userEvent.click(screen.getByRole('button', { name: /hisob yaratish/i }))

        expect(onCreate).toHaveBeenCalledWith('g1')
    })

    // 409 — xato emas, odatiy holat: administrator ikkinchi marta bosgan.
    // Serverning inglizcha matni o'rniga o'z matnimiz chiqishi kerak.
    it('409 da tushunarli xabar ko‘rsatadi', () => {
        render({ error: new ApiError('Invoice already created', 409, 'AlreadyExists') })
        expect(screen.getByText(/allaqachon yaratilgan/i)).toBeInTheDocument()
    })

    it('boshqa xatoda server matnini ko‘rsatadi', () => {
        render({ error: new ApiError('Group has no students', 404, 'NotFound') })
        expect(screen.getByText(/no students/i)).toBeInTheDocument()
    })
})
