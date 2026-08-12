import { useState, type ComponentType, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ApiError } from '@/shared/api'
import { AuthProvider } from './AuthProvider'
import { ThemeProvider } from './ThemeProvider'

/**
 * QueryClient komponent ichida yaratiladi (modul darajasida emas), aks holda
 * testlar bir-birining cache'ini meros qilib oladi.
 */
function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // 30s — jadvalni har fokusda qayta yuklamaslik uchun yetarli,
                // lekin ma'lumot eskirib ketmaydigan darajada qisqa.
                staleTime: 30_000,
                retry: (failureCount, error) => {
                    // 4xx ni qayta urinish mantiqsiz: javob o'zgarmaydi.
                    if (error instanceof ApiError && error.status < 500) return false
                    return failureCount < 2
                },
            },
        },
    })
}

interface AppProvidersProps {
    children: ReactNode
    /**
     * Marshrutlagichni almashtirish uchun. Odatda kerak emas; demo build
     * `MemoryRouter` beradi, chunki u iframe ichida ishlaydi va u yerda
     * URL o'zgartirish (pushState) bloklanishi mumkin.
     */
    router?: ComponentType<{ children: ReactNode }>
}

export function AppProviders({ children, router: Router = BrowserRouter }: AppProvidersProps) {
    const [queryClient] = useState(createQueryClient)

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <Router>
                    <AuthProvider>{children}</AuthProvider>
                </Router>
            </ThemeProvider>
        </QueryClientProvider>
    )
}
