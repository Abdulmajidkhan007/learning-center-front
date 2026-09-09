import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { BalanceCard } from './BalanceCard'
import type { StudentDto } from '@/shared/types'

const student: StudentDto = { id: 'st-1', balance: -300000 }

describe('BalanceCard', () => {
    it('balansni ko‘rsatadi', () => {
        renderWithProviders(<BalanceCard student={student} />)

        expect(screen.getByText(/300/)).toBeInTheDocument()
    })

    // Guruhi yo'q o'quvchi ham balansini ko'rishi kerak — balans butun
    // o'quvchiga tegishli, guruhga emas.
    it('guruhi yo‘q o‘quvchining ham balansi ko‘rsatiladi', () => {
        renderWithProviders(<BalanceCard student={{ id: 'st-1', balance: -50000 }} />)

        expect(screen.getByText(/50/)).toBeInTheDocument()
    })

    it('o‘quvchi kartasi hali kelmagan bo‘lsa kutish holati chiqadi', () => {
        renderWithProviders(<BalanceCard student={null} />)

        expect(screen.queryByText(/300/)).not.toBeInTheDocument()
    })

    // Balans nolga teng bo'lishi mumkin — `undefined` bilan chalkashmasin.
    it('nol balansni ham ko‘rsatadi', () => {
        renderWithProviders(<BalanceCard student={{ id: 'st-1', balance: 0 }} />)

        expect(screen.getByText('0')).toBeInTheDocument()
    })
})
