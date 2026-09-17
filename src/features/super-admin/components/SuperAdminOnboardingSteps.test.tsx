import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { SuperAdminOnboardingSteps } from './SuperAdminOnboardingSteps'

describe('SuperAdminOnboardingSteps', () => {
    it('tizim bo‘sh bo‘lganda (barcha sonlar 0) 3 ta qadamni ko‘rsatadi', () => {
        const onTabChange = vi.fn()
        const onOpenOrgModal = vi.fn()
        const onOpenBranchModal = vi.fn()

        renderWithProviders(
            <SuperAdminOnboardingSteps
                organizationCount={0}
                branchCount={0}
                adminCount={0}
                onTabChange={onTabChange}
                onOpenOrgModal={onOpenOrgModal}
                onOpenBranchModal={onOpenBranchModal}
            />
        )

        expect(screen.getByText(/boshlang‘ich sozlash qadamlari/i)).toBeInTheDocument()
        expect(screen.getByText(/tashkilot ma’lumotlarini to‘ldirish/i)).toBeInTheDocument()
        expect(screen.getByText(/filial qo‘shish/i)).toBeInTheDocument()
        expect(screen.getByText(/administrator qo‘shish/i)).toBeInTheDocument()
    })

    it('birinchi qadam bajarilganda chizilgan holda bo‘ladi va 2-qadam ajratib ko‘rsatiladi', () => {
        const onTabChange = vi.fn()
        const onOpenOrgModal = vi.fn()
        const onOpenBranchModal = vi.fn()

        renderWithProviders(
            <SuperAdminOnboardingSteps
                organizationCount={1}
                branchCount={0}
                adminCount={0}
                onTabChange={onTabChange}
                onOpenOrgModal={onOpenOrgModal}
                onOpenBranchModal={onOpenBranchModal}
            />
        )

        const orgStepText = screen.getByText(/tashkilot ma’lumotlarini to‘ldirish/i)
        expect(orgStepText).toHaveClass('line-through')

        const branchStepText = screen.getByText(/filial qo‘shish/i)
        expect(branchStepText).not.toHaveClass('line-through')
    })

    it('qadamlar bosilganda modal va tab almashtirish chaqiriladi', async () => {
        const user = userEvent.setup()
        const onTabChange = vi.fn()
        const onOpenOrgModal = vi.fn()
        const onOpenBranchModal = vi.fn()

        renderWithProviders(
            <SuperAdminOnboardingSteps
                organizationCount={0}
                branchCount={0}
                adminCount={0}
                onTabChange={onTabChange}
                onOpenOrgModal={onOpenOrgModal}
                onOpenBranchModal={onOpenBranchModal}
            />
        )

        await user.click(screen.getByText(/tashkilot ma’lumotlarini to‘ldirish/i))
        expect(onTabChange).toHaveBeenCalledWith('organizations')
        expect(onOpenOrgModal).toHaveBeenCalled()

        await user.click(screen.getByText(/filial qo‘shish/i))
        expect(onTabChange).toHaveBeenCalledWith('branches')
        expect(onOpenBranchModal).toHaveBeenCalled()

        await user.click(screen.getByText(/administrator qo‘shish/i))
        expect(onTabChange).toHaveBeenCalledWith('organizations')
        expect(onOpenOrgModal).toHaveBeenCalled()
    })

    it('barcha 3 ta qadam bajarilganda (sonlar > 0) blok umuman ko‘rinmaydi', () => {
        const onTabChange = vi.fn()
        const onOpenOrgModal = vi.fn()
        const onOpenBranchModal = vi.fn()

        renderWithProviders(
            <SuperAdminOnboardingSteps
                organizationCount={1}
                branchCount={2}
                adminCount={1}
                onTabChange={onTabChange}
                onOpenOrgModal={onOpenOrgModal}
                onOpenBranchModal={onOpenBranchModal}
            />
        )

        expect(screen.queryByText(/boshlang‘ich sozlash qadamlari/i)).not.toBeInTheDocument()
    })
})
