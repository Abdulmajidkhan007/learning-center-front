import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AdminDashboardPage } from './AdminDashboardPage'
import type { AdminPermission } from '@/shared/types'

const { sessionState } = vi.hoisted(() => ({
    sessionState: { role: 'ADMINISTRATOR', permissions: [] as AdminPermission[] },
}))

/**
 * `useSession`/`useHasPermission` ni soxtalashtiramiz — bu testda ruxsatga
 * qarab UI ko'rinishi tekshirilyapti, auth oqimining o'zi emas.
 */
vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({
        token: 'test-token',
        role: sessionState.role,
        claims: {},
        permissions: sessionState.permissions,
    }),
    useAuth: () => ({ session: null, signIn: vi.fn(), signOut: vi.fn(), isRestoring: false }),
    useHasPermission: (permission: AdminPermission) =>
        sessionState.role === 'SUPER_ADMIN' || sessionState.permissions.includes(permission),
}))

/** Har bir so'rovga bo'sh sahifa qaytaradi — jadval/hisoblagichlar buzilmaydi. */
function mockFetch() {
    const body = { content: [], totalPages: 1, totalElements: 0 }
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            text: () => Promise.resolve(JSON.stringify(body)),
            json: () => Promise.resolve(body),
        })
    )
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    sessionState.role = 'ADMINISTRATOR'
    sessionState.permissions = []
})

describe('AdminDashboardPage — ruxsatlar', () => {
    it('LEAD_MANAGEMENT yo‘q administratorga "Lidlar" tugmasi ko‘rinmaydi', () => {
        mockFetch()
        sessionState.permissions = ['STUDENT_MANAGEMENT', 'TEACHER_MANAGEMENT', 'INVOICE_MANAGEMENT']

        renderWithProviders(<AdminDashboardPage />)

        expect(screen.queryByRole('button', { name: /lidlar/i })).not.toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: /to.lovlar/i }).length).toBeGreaterThan(0)
    })

    it('LEAD_MANAGEMENT bor administratorga "Lidlar" tugmasi ko‘rinadi', () => {
        mockFetch()
        sessionState.permissions = ['LEAD_MANAGEMENT']

        renderWithProviders(<AdminDashboardPage />)

        expect(screen.getAllByRole('button', { name: /lidlar/i }).length).toBeGreaterThan(0)
    })

    it('STUDENT_MANAGEMENT yo‘q administratorga O‘quvchilar tabi ko‘rinmaydi', () => {
        mockFetch()
        sessionState.permissions = ['TEACHER_MANAGEMENT']

        renderWithProviders(<AdminDashboardPage />)

        expect(screen.queryByText(/o.quvchilar/i)).not.toBeInTheDocument()
    })
})

describe('AdminDashboardPage — onboarding qadamlari', () => {
    it('tizim bo‘sh bo‘lganda boshlang‘ich sozlash qadamlari bloki ko‘rinadi', async () => {
        mockFetch()
        sessionState.permissions = ['STUDENT_MANAGEMENT', 'TEACHER_MANAGEMENT', 'LEAD_MANAGEMENT', 'INVOICE_MANAGEMENT']

        renderWithProviders(<AdminDashboardPage />)

        expect(await screen.findByText(/boshlang‘ich sozlash qadamlari/i)).toBeInTheDocument()
    })

    it('barcha 4 ta qadam bajarilganda onboarding bloki ko‘rinmaydi', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockImplementation((url: unknown) => {
                const urlString = typeof url === 'string' ? url : (url as { url: string })?.url || ''
                let body: unknown = { content: [{ id: '1' }], totalPages: 1, totalElements: 1 }
                if (urlString.includes('/group-level/names')) {
                    body = [{ id: '1', name: 'A1' }]
                } else if (urlString.includes('/count')) {
                    body = 5
                }
                const text = JSON.stringify(body)
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    text: () => Promise.resolve(text),
                    json: () => Promise.resolve(body),
                })
            })
        )
        sessionState.permissions = ['STUDENT_MANAGEMENT', 'TEACHER_MANAGEMENT']

        renderWithProviders(<AdminDashboardPage />)

        // Count so'rovlari va level so'rovi muvaffaqiyatli tugashini kutamiz
        await screen.findAllByText('5')
        expect(screen.queryByText(/boshlang‘ich sozlash qadamlari/i)).not.toBeInTheDocument()
    })
})
