import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { OnboardingSteps } from './OnboardingSteps'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

describe('OnboardingSteps', () => {
    it('tizim bo‘sh bo‘lganda (barcha sonlar 0) onboarding blokini va 4 ta qadamni ko‘rsatadi', () => {
        const onTabChange = vi.fn()

        renderWithProviders(
            <OnboardingSteps
                levelCount={0}
                teacherCount={0}
                groupCount={0}
                studentCount={0}
                onTabChange={onTabChange}
            />
        )

        expect(screen.getByText(/boshlang‘ich sozlash qadamlari/i)).toBeInTheDocument()
        expect(screen.getByText(/daraja \(kurs\) qo‘shish/i)).toBeInTheDocument()
        expect(screen.getByText(/o‘qituvchi qo‘shish/i)).toBeInTheDocument()
        expect(screen.getByText(/guruh yaratish/i)).toBeInTheDocument()
        expect(screen.getByText(/o‘quvchi qo‘shish/i)).toBeInTheDocument()
    })

    it('birinchi qadam (daraja) bajarilganda chizilgan holda bo‘ladi va keyingi qadam ajratib ko‘rsatiladi', () => {
        const onTabChange = vi.fn()

        renderWithProviders(
            <OnboardingSteps
                levelCount={1}
                teacherCount={0}
                groupCount={0}
                studentCount={0}
                onTabChange={onTabChange}
            />
        )

        const levelStepText = screen.getByText(/daraja \(kurs\) qo‘shish/i)
        expect(levelStepText).toHaveClass('line-through')

        const teacherStepText = screen.getByText(/o‘qituvchi qo‘shish/i)
        expect(teacherStepText).not.toHaveClass('line-through')
    })

    it('qadamlar bosilganda tegishli marshrut yoki tabga o‘tadi', async () => {
        const user = userEvent.setup()
        const onTabChange = vi.fn()

        renderWithProviders(
            <OnboardingSteps
                levelCount={0}
                teacherCount={0}
                groupCount={0}
                studentCount={0}
                onTabChange={onTabChange}
            />
        )

        await user.click(screen.getByText(/daraja \(kurs\) qo‘shish/i))
        expect(mockNavigate).toHaveBeenCalledWith('/group-levels')

        await user.click(screen.getByText(/o‘qituvchi qo‘shish/i))
        expect(onTabChange).toHaveBeenCalledWith('teachers')

        await user.click(screen.getByText(/guruh yaratish/i))
        expect(onTabChange).toHaveBeenCalledWith('groups')

        await user.click(screen.getByText(/o‘quvchi qo‘shish/i))
        expect(onTabChange).toHaveBeenCalledWith('students')
    })

    it('barcha 4 ta qadam bajarilganda (sonlar > 0) blok umuman ko‘rinmaydi', () => {
        const onTabChange = vi.fn()

        renderWithProviders(
            <OnboardingSteps
                levelCount={2}
                teacherCount={3}
                groupCount={1}
                studentCount={10}
                onTabChange={onTabChange}
            />
        )

        expect(screen.queryByText(/boshlang‘ich sozlash qadamlari/i)).not.toBeInTheDocument()
    })
})
