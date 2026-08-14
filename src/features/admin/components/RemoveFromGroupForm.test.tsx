import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { RemoveFromGroupForm } from './RemoveFromGroupForm'

function renderForm(onSubmit = vi.fn()) {
    renderWithProviders(
        <RemoveFromGroupForm isPending={false} onSubmit={onSubmit} onCancel={vi.fn()} />
    )
    return {
        onSubmit,
        input: screen.getByLabelText(/chiqarish sababi/i),
        submit: screen.getByRole('button', { name: /^chiqarish$/i }),
    }
}

describe('RemoveFromGroupForm', () => {
    // Backend `reason` ni majburiy `@RequestParam` qilib olgan — bo'sh
    // yuborilsa 400 qaytadi, shuning uchun tugma o'chiq turadi.
    it('sabab yozilmaguncha tugma bosilmaydi', () => {
        const { submit } = renderForm()
        expect(submit).toBeDisabled()
    })

    it('faqat bo’shliqdan iborat sabab qabul qilinmaydi', async () => {
        const { input, submit } = renderForm()
        await userEvent.type(input, '   ')
        expect(submit).toBeDisabled()
    })

    it('sabab yozilsa uni bo’shliqsiz uzatadi', async () => {
        const { input, submit, onSubmit } = renderForm()
        await userEvent.type(input, '  boshqa markazga o‘tdi  ')
        await userEvent.click(submit)
        expect(onSubmit).toHaveBeenCalledWith('boshqa markazga o‘tdi')
    })
})
