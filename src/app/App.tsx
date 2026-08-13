import type { ComponentType, ReactNode } from 'react'
import { AppProviders } from './providers/AppProviders'
import { AppRoutes } from './routes/AppRoutes'

export default function App({ router }: { router?: ComponentType<{ children: ReactNode }> }) {
    return (
        <AppProviders router={router}>
            <AppRoutes />
        </AppProviders>
    )
}
