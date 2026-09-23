import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { SuperAdminOnboardingSteps } from './SuperAdminOnboardingSteps'

describe('SuperAdminOnboardingSteps', () => {
    it('bajarilmagan qadamlarni ko’rsatadi', () => {
        renderWithProviders(
            <SuperAdminOnboardingSteps branchCount={0} adminCount={0} onOpenBranches={vi.fn()} />
        )

        expect(screen.getByText(/filial/i)).toBeInTheDocument()
        expect(screen.getByText(/administrator/i)).toBeInTheDocument()
    })

    /*
     * Tashkilot qadami ataylab olib tashlangan: tashkilotni dasturchi
     * ochadi va unga faqat nom kerak. Qolgan ma'lumotni egasi keyin
     * kiritadi — birinchi kundayoq majburlash ortiqcha.
     */
    it('tashkilot qadamini ko’rsatmaydi', () => {
        renderWithProviders(
            <SuperAdminOnboardingSteps branchCount={0} adminCount={0} onOpenBranches={vi.fn()} />
        )

        expect(screen.queryByText(/tashkilot ma’lumot|tashkilot ma'lumot/i)).not.toBeInTheDocument()
    })

    it('filial qadami bosilsa filiallarga o’tadi', async () => {
        const user = userEvent.setup()
        const onOpenBranches = vi.fn()

        renderWithProviders(
            <SuperAdminOnboardingSteps
                branchCount={0}
                adminCount={0}
                onOpenBranches={onOpenBranches}
            />
        )

        await user.click(screen.getByText(/filial/i))
        expect(onOpenBranches).toHaveBeenCalled()
    })

    // Hammasi bajarilgach blok ko'zga tashlanib turishi shart emas.
    it('ikkala qadam bajarilsa umuman ko’rinmaydi', () => {
        const { container } = renderWithProviders(
            <SuperAdminOnboardingSteps branchCount={2} adminCount={1} onOpenBranches={vi.fn()} />
        )

        expect(container).toBeEmptyDOMElement()
    })
})
