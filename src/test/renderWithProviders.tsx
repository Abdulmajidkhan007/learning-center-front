import type { ReactElement, ReactNode } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { LocaleProvider } from '@/app/providers/LocaleProvider'
import { ThemeProvider } from '@/app/providers/ThemeProvider'

/**
 * Testlar uchun QueryClient: retry o'chirilgan (xato testi 3 marta
 * kutib turmasin) va cache umri nol.
 */
export function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0, staleTime: 0 },
            mutations: { retry: false },
        },
    })
}

interface Options extends Omit<RenderOptions, 'wrapper'> {
    /** Boshlang'ich marshrut, masalan `/attendance`. */
    route?: string
}

/**
 * Provider'lar bilan render.
 *
 * Til testlarda sukut bo'yicha o'zbekcha — ilovadagi bilan bir xil, ya'ni
 * testlar foydalanuvchi ko'radigan matnni tekshiradi.
 */
export function renderWithProviders(ui: ReactElement, { route = '/', ...options }: Options = {}) {
    const queryClient = createTestQueryClient()

    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <QueryClientProvider client={queryClient}>
                <LocaleProvider>
                    <ThemeProvider>
                        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
                    </ThemeProvider>
                </LocaleProvider>
            </QueryClientProvider>
        )
    }

    return { queryClient, ...render(ui, { wrapper: Wrapper, ...options }) }
}
