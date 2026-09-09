import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { NewPaymentModal } from './NewPaymentModal'

const studentOptions = [{ value: 'st-1', label: 'Aziza Karimova' }]

function render(onSubmit = vi.fn()) {
    renderWithProviders(
        <NewPaymentModal
            studentOptions={studentOptions}
            isSaving={false}
            error={null}
            onSubmit={onSubmit}
            onClose={vi.fn()}
        />
    )
    return onSubmit
}

describe('NewPaymentModal', () => {
    it('o‘quvchi va summa berilganda to‘lovni yuboradi', async () => {
        const onSubmit = render()

        await userEvent.selectOptions(screen.getByLabelText(/o.quvchi/i), 'st-1')
        await userEvent.type(screen.getByLabelText(/summa/i), '400000')
        await userEvent.click(screen.getByRole('button', { name: /saqlash/i }))

        expect(onSubmit).toHaveBeenCalledWith({ type: 'PAID', amount: 400000, studentId: 'st-1' })
    })

    // Summa 0 yoki manfiy bo'lsa backend baribir rad etadi — formada to'xtatamiz.
    it('o‘quvchi tanlanmaguncha saqlash tugmasi o‘chiq', async () => {
        render()

        await userEvent.type(screen.getByLabelText(/summa/i), '400000')
        expect(screen.getByRole('button', { name: /saqlash/i })).toBeDisabled()
    })
})
