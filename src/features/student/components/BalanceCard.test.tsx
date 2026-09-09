import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { BalanceCard } from './BalanceCard'
import type { StudentDto } from '@/shared/types'

const student: StudentDto = { id: 'st-1', balance: -300000 }

describe('BalanceCard', () => {
    it('balansni ko‘rsatadi', () => {
        renderWithProviders(<BalanceCard student={student} hasGroup />)

        expect(screen.getByText(/300/)).toBeInTheDocument()
    })

    it('guruh yo‘q bo‘lsa balans o‘rniga bo‘sh holat chiqadi', () => {
        renderWithProviders(<BalanceCard student={null} hasGroup={false} />)

        expect(screen.queryByText(/300/)).not.toBeInTheDocument()
    })

    // Balans nolga teng bo'lishi mumkin — `undefined` bilan chalkashmasin.
    it('nol balansni ham ko‘rsatadi', () => {
        renderWithProviders(<BalanceCard student={{ id: 'st-1', balance: 0 }} hasGroup />)

        expect(screen.getByText('0')).toBeInTheDocument()
    })
})
