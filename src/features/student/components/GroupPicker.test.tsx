import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { GroupPicker } from './GroupPicker'
import type { GroupDto } from '@/shared/types'

const oneGroup: GroupDto[] = [{ id: 'g1', name: 'Beginners A' }]
const twoGroups: GroupDto[] = [
    { id: 'g1', name: 'Beginners A' },
    { id: 'g2', name: 'IELTS Intensive' },
]

describe('GroupPicker', () => {
    it('bitta guruh kelganda tanlagich ko‘rsatilmaydi', () => {
        renderWithProviders(<GroupPicker groups={oneGroup} selectedId="g1" onSelect={vi.fn()} />)
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    })

    it('bir nechta guruh kelganda tanlagich chiqadi', () => {
        renderWithProviders(<GroupPicker groups={twoGroups} selectedId="g1" onSelect={vi.fn()} />)
        expect(screen.getByRole('combobox')).toBeInTheDocument()
        expect(screen.getByRole('option', { name: 'IELTS Intensive' })).toBeInTheDocument()
    })

    it('guruh yo‘q bo‘lsa ham tanlagich ko‘rsatilmaydi', () => {
        renderWithProviders(<GroupPicker groups={[]} selectedId="" onSelect={vi.fn()} />)
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    })
})
