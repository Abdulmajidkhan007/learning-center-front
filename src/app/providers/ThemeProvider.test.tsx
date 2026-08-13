import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from './ThemeProvider'
import { useTheme } from './useTheme'

function ThemeProbe() {
    const { theme, toggleTheme } = useTheme()
    return (
        <button type="button" onClick={toggleTheme}>
            current: {theme}
        </button>
    )
}

beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    // jsdom da matchMedia yo'q — tizim sozlamasini "light" deb ko'rsatamiz.
    vi.stubGlobal(
        'matchMedia',
        vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    )
})

afterEach(() => vi.unstubAllGlobals())

describe('ThemeProvider', () => {
    it('saqlangan tanlov bo’lmasa tizim sozlamasidan boshlaydi', () => {
        render(
            <ThemeProvider>
                <ThemeProbe />
            </ThemeProvider>
        )
        expect(screen.getByRole('button')).toHaveTextContent('current: light')
        expect(document.documentElement).not.toHaveClass('dark')
    })

    it('saqlangan tanlovni tizim sozlamasidan ustun qo’yadi', () => {
        localStorage.setItem('clc-theme', 'dark')
        render(
            <ThemeProvider>
                <ThemeProbe />
            </ThemeProvider>
        )
        expect(screen.getByRole('button')).toHaveTextContent('current: dark')
        expect(document.documentElement).toHaveClass('dark')
    })

    it('almashtirganda <html> klassi va localStorage yangilanadi', async () => {
        const user = userEvent.setup()
        render(
            <ThemeProvider>
                <ThemeProbe />
            </ThemeProvider>
        )

        await user.click(screen.getByRole('button'))

        expect(document.documentElement).toHaveClass('dark')
        expect(localStorage.getItem('clc-theme')).toBe('dark')
    })

    it('provider’siz ishlatilsa tushunarli xato beradi', () => {
        // React xatoni konsolga chiqaradi — testda shovqin bo'lmasin.
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
        expect(() => render(<ThemeProbe />)).toThrow(/useTheme must be used inside/)
        spy.mockRestore()
    })
})
