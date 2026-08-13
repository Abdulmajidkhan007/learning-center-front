import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { PasswordSection } from './PasswordSection'

/**
 * `useSession` sessiya bor deb hisoblaydi, shuning uchun uni soxtalashtiramiz —
 * bu testda auth oqimi emas, forma va so'rov shakli tekshirilyapti.
 */
vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({ token: 'test-token', role: 'TEACHER', claims: {} }),
    useAuth: () => ({ session: null, signIn: vi.fn(), signOut: vi.fn(), isRestoring: false }),
}))

function mockFetch(body: object, ok = true, status = 200) {
    const fetchMock = vi.fn().mockResolvedValue({
        ok,
        status,
        text: () => Promise.resolve(JSON.stringify(body)),
        json: () => Promise.resolve(body),
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

async function fillForm(user: ReturnType<typeof userEvent.setup>, next: string, repeat: string) {
    await user.type(screen.getByLabelText(/joriy parol/i), 'eski-parol')
    await user.type(screen.getByLabelText(/^yangi parol$/i), next)
    await user.type(screen.getByLabelText(/takrorlang/i), repeat)
    await user.click(screen.getByRole('button', { name: /saqlash/i }))
}

describe('PasswordSection', () => {
    it('parollar mos kelmasa so’rov umuman yuborilmaydi', async () => {
        const user = userEvent.setup()
        const fetchMock = mockFetch({})

        renderWithProviders(<PasswordSection />)
        await fillForm(user, 'yangi-parol-1', 'boshqa-parol-2')

        expect(await screen.findByRole('alert')).toBeInTheDocument()
        expect(fetchMock).not.toHaveBeenCalled()
    })

    it('qisqa parolni ham serverga yubormaydi', async () => {
        const user = userEvent.setup()
        const fetchMock = mockFetch({})

        renderWithProviders(<PasswordSection />)
        await fillForm(user, 'qisqa', 'qisqa')

        expect(await screen.findByRole('alert')).toBeInTheDocument()
        expect(fetchMock).not.toHaveBeenCalled()
    })

    // Backend `ChangePasswordRequest{oldPassword, newPassword, confirmPassword}`
    // kutadi — nom o'zgarsa shu test yiqiladi.
    it('backend kutgan maydon nomlari bilan yuboradi', async () => {
        const user = userEvent.setup()
        const fetchMock = mockFetch({ response: 'Password changed successfully' })

        renderWithProviders(<PasswordSection />)
        await fillForm(user, 'yangi-parol-1', 'yangi-parol-1')

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

        const [url, init] = fetchMock.mock.calls[0]
        expect(url).toBe('/api/v1/auth/change-password')
        expect(JSON.parse(String(init.body))).toEqual({
            oldPassword: 'eski-parol',
            newPassword: 'yangi-parol-1',
            confirmPassword: 'yangi-parol-1',
        })
        expect(init.headers).toMatchObject({ Authorization: 'Bearer test-token' })
    })

    it('muvaffaqiyatdan keyin maydonlarni tozalaydi', async () => {
        const user = userEvent.setup()
        mockFetch({ response: 'Password changed successfully' })

        renderWithProviders(<PasswordSection />)
        await fillForm(user, 'yangi-parol-1', 'yangi-parol-1')

        await waitFor(() =>
            expect(screen.getByLabelText(/joriy parol/i)).toHaveValue('')
        )
    })
})
