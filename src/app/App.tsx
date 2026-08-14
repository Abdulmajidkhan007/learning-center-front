import type { ComponentType, ReactNode } from 'react'
import { ErrorBoundary } from './ErrorBoundary'
import { AppProviders } from './providers/AppProviders'
import { AppRoutes } from './routes/AppRoutes'

export default function App({ router }: { router?: ComponentType<{ children: ReactNode }> }) {
    return (
        // ErrorBoundary provider'lardan TASHQARIDA: provider'ning o'zi
        // yiqilsa ham foydalanuvchi oq ekran emas, xabar ko'rsin.
        <ErrorBoundary>
            <AppProviders router={router}>
                <AppRoutes />
            </AppProviders>
        </ErrorBoundary>
    )
}
