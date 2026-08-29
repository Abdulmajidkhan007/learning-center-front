import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { renderWithProviders } from '@/test/renderWithProviders'
import { PaymentsPage } from '@/features/payments/pages/PaymentsPage'
import { RequireRole } from './RequireRole'

/**
 * `useSession` bu yerda sessiyani soxtalashtiradi — testda auth oqimi emas,
 * rol tekshiruvi tekshirilyapti (xuddi `PasswordSection.test.tsx`dagidek).
 */
vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({ token: 'test-token', role: 'STUDENT', claims: {} }),
    useAuth: () => ({ session: null, signIn: vi.fn(), signOut: vi.fn(), isRestoring: false }),
}))

/**
 * `PaymentsPage`ning o'zi soxtalashtirilgan: uning ichidagi so'rovlar
 * (`useInvoices` va h.k.) bu testga aloqasi yo'q — bu yerda faqat
 * `RequireRole` uni umuman render qilmasligi tekshiriladi.
 */
vi.mock('@/features/payments/pages/PaymentsPage', () => ({
    PaymentsPage: () => <div>To‘lovlar sahifasi</div>,
}))

describe('RequireRole', () => {
    it('STUDENT roli bilan /payments ochilganda PaymentsPage render bo‘lmaydi', () => {
        renderWithProviders(
            <Routes>
                <Route
                    path="/payments"
                    element={
                        <RequireRole roles={['ADMINISTRATOR', 'TEACHER', 'SUPER_ADMIN']}>
                            <PaymentsPage />
                        </RequireRole>
                    }
                />
                <Route path="/" element={<div>Bosh sahifa</div>} />
            </Routes>,
            { route: '/payments' }
        )

        expect(screen.queryByText('To‘lovlar sahifasi')).not.toBeInTheDocument()
        expect(screen.getByText('Bosh sahifa')).toBeInTheDocument()
    })
})
