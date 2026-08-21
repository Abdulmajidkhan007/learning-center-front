import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { LeadTable } from './LeadTable'
import type { LeadDto } from '@/shared/types'

const lead: LeadDto = {
    id: 'l1',
    fullName: 'Aziza Karimova',
    phone: '+998901234567',
    source: 'INSTAGRAM',
    preferredCourse: 'IELTS',
    status: 'NEW',
}

function renderTable(leads: LeadDto[], onDelete = vi.fn()) {
    renderWithProviders(
        <LeadTable leads={leads} isLoading={false} onStatusChange={vi.fn()} onDelete={onDelete} />
    )
    return onDelete
}

describe('LeadTable', () => {
    it('lid ismi va manbasini ko’rsatadi', () => {
        renderTable([lead])
        expect(screen.getByText('Aziza Karimova')).toBeInTheDocument()
        expect(screen.getByText('Instagram')).toBeInTheDocument()
    })

    it('o‘chirish tugmasi bosilsa lidni uzatadi', async () => {
        const onDelete = renderTable([lead])
        await userEvent.click(screen.getByRole('button', { name: /o.chirish/i }))
        expect(onDelete).toHaveBeenCalledWith(lead)
    })

    it('ro’yxat bo’sh bo’lsa tushunarli xabar chiqadi', () => {
        renderTable([])
        expect(screen.getByText(/lid topilmadi/i)).toBeInTheDocument()
    })
})
