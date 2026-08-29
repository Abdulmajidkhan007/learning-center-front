import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { CentreForm } from './CentreForm'
import type { BranchDto } from '@/shared/types'

const branch: BranchDto = {
    id: 'b1',
    name: 'Chilonzor filiali',
    address: 'Toshkent, Chilonzor 5',
    chargeForMonth: 450000,
    googleMapsUrl: 'https://maps.example/1',
}

function renderForm(onSave = vi.fn(), override: Partial<BranchDto> = {}) {
    renderWithProviders(
        <CentreForm
            branch={{ ...branch, ...override }}
            isSaving={false}
            isSaved={false}
            error={null}
            onSave={onSave}
        />
    )
    return onSave
}

describe('CentreForm', () => {
    it('serverdan kelgan qiymatlar bilan to’ladi', () => {
        renderForm()
        expect(screen.getByDisplayValue('Chilonzor filiali')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Toshkent, Chilonzor 5')).toBeInTheDocument()
        expect(screen.getByDisplayValue('450000')).toBeInTheDocument()
    })

    it('saqlaganda o’zgargan qiymatni uzatadi', async () => {
        const onSave = renderForm()
        const nameInput = screen.getByDisplayValue('Chilonzor filiali')

        await userEvent.clear(nameInput)
        await userEvent.type(nameInput, 'Yunusobod filiali')
        await userEvent.click(screen.getByRole('button', { name: /saqlash/i }))

        expect(onSave).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Yunusobod filiali', chargeForMonth: 450000 })
        )
    })

    // Bo'sh summani `0` deb yuborsak, oylik to'lov bilmasdan nolga tushardi.
    it('summa bo’sh bo’lsa uni umuman yubormaydi', async () => {
        const onSave = renderForm(vi.fn(), { chargeForMonth: undefined })
        await userEvent.click(screen.getByRole('button', { name: /saqlash/i }))

        expect(onSave).toHaveBeenCalledWith(
            expect.objectContaining({ chargeForMonth: undefined })
        )
    })
})
