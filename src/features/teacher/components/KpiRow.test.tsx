import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { KpiRow } from './KpiRow'

describe('KpiRow', () => {
    it('kelgan sonlarni ko’rsatadi', () => {
        renderWithProviders(
            <KpiRow
                stats={{
                    totalStudents: 42,
                    activeStudents: 38,
                    newStudents: 5,
                    lostStudents: 1,
                    potentialFailStudents: 3,
                    redList: 0,
                    blackList: 0,
                }}
            />
        )

        expect(screen.getByText('42')).toBeInTheDocument()
        expect(screen.getByText('38')).toBeInTheDocument()
        expect(screen.getByText('3')).toBeInTheDocument()
    })

    /*
     * Backend qizil va qora ro'yxatni hali hisoblamaydi — so'rovda ikkalasi
     * ham qat'iy 0. Uni "0 ta muammoli o'quvchi" deb ko'rsatsak, o'qituvchi
     * sanalmagan narsani sanalgan deb o'ylaydi.
     */
    it('hisoblanmaydigan ikkitasini nol emas, "—" qilib ko’rsatadi', () => {
        renderWithProviders(
            <KpiRow stats={{ totalStudents: 42, activeStudents: 38, redList: 0, blackList: 0 }} />
        )

        // Ikkita "—": qizil va qora ro'yxat. Nol bo'lib ko'rinmasligi kerak.
        expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2)
        expect(screen.queryByText('0')).not.toBeInTheDocument()
    })
})
