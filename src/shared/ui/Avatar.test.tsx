import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/renderWithProviders'
import { Avatar } from './Avatar'

describe('Avatar', () => {
    it('rasm va fallback berilmasa ism bosh harflarini ko‘rsatadi', () => {
        const { getByText } = renderWithProviders(<Avatar name="Aziza Karimova" />)

        expect(getByText('AK')).toBeInTheDocument()
    })

    it("fallback='silhouette' bo‘lsa bosh harflar o‘rniga siluet chiziladi", () => {
        const { queryByText, container } = renderWithProviders(<Avatar name="Aziza Karimova" fallback="silhouette" />)

        expect(queryByText('AK')).not.toBeInTheDocument()
        expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('rasm berilsa fallback qanday bo‘lishidan qat’i nazar rasm ko‘rsatiladi', () => {
        const { container, queryByText } = renderWithProviders(
            <Avatar name="Aziza Karimova" src="https://example.com/a.jpg" fallback="silhouette" />
        )

        expect(container.querySelector('img[src="https://example.com/a.jpg"]')).toBeInTheDocument()
        expect(queryByText('AK')).not.toBeInTheDocument()
    })
})
