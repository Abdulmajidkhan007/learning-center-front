import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { CollapsibleSection } from './CollapsibleSection'

describe('CollapsibleSection', () => {
    it('defaultOpen bo‘lmasa boshida yopiq turadi', () => {
        renderWithProviders(
            <CollapsibleSection title="Sozlamalar">
                <p>Ichki matn</p>
            </CollapsibleSection>
        )

        expect(screen.queryByText('Ichki matn')).not.toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Sozlamalar' })).toHaveAttribute('aria-expanded', 'false')
    })

    it('defaultOpen bo‘lsa boshida ochiq turadi', () => {
        renderWithProviders(
            <CollapsibleSection title="Guruhim va davomat" defaultOpen>
                <p>Ichki matn</p>
            </CollapsibleSection>
        )

        expect(screen.getByText('Ichki matn')).toBeInTheDocument()
    })

    it('sarlavhaga bosilganda ochiladi va yopiladi', async () => {
        const user = userEvent.setup()
        renderWithProviders(
            <CollapsibleSection title="Ma’lumotlarim">
                <p>Ichki matn</p>
            </CollapsibleSection>
        )

        const toggle = screen.getByRole('button', { name: 'Ma’lumotlarim' })

        await user.click(toggle)
        expect(screen.getByText('Ichki matn')).toBeInTheDocument()
        expect(toggle).toHaveAttribute('aria-expanded', 'true')

        await user.click(toggle)
        expect(screen.queryByText('Ichki matn')).not.toBeInTheDocument()
        expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })
})
