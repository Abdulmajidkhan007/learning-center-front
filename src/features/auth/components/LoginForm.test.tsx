import { afterEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { LoginForm } from './LoginForm'

/** Imzosiz, lekin to’g’ri tuzilgan JWT (faqat payload o’qiladi). */
function tokenWithRole(role: string): string {
    const encode = (value: object) =>
        btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    return `${encode({ alg: 'HS256' })}.${encode({ role })}.sig`
}

/**
 * Kirish oynasi ikki xil so'rov yuboradi: tashkilotlar ro'yxati va login'ning
 * o'zi. Ikkalasiga bir xil javob berib bo'lmaydi — ro'yxat massiv, login esa
 * obyekt, shuning uchun mock manzilga qarab ajratadi.
 */
function mockLoginResponse(body: object, ok = true, status = 200) {
    const respond = (payload: unknown, responseOk: boolean, responseStatus: number) => ({
        ok: responseOk,
        status: responseStatus,
        text: () => Promise.resolve(JSON.stringify(payload)),
        json: () => Promise.resolve(payload),
    })

    vi.stubGlobal(
        'fetch',
        vi.fn().mockImplementation((url: string) =>
            Promise.resolve(
                String(url).includes('/organization/name')
                    ? respond([{ id: 'org-1', name: 'Demo markaz' }], true, 200)
                    : respond(body, ok, status)
            )
        )
    )
}

/** Login so'rovining tanasi — birinchi chaqiruv tashkilotlar ro'yxati bo'lishi mumkin. */
function loginRequestBody() {
    const call = vi.mocked(fetch).mock.calls.find(([url]) => String(url).includes('/auth/login'))
    return JSON.parse(String(call?.[1]?.body))
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('LoginForm', () => {
    /*
     * Tashkilotlar ro'yxati kelmasa ham kirishga urinib ko'rish mumkin
     * bo'lishi kerak: aks holda backenddagi bitta nosozlik butun tizimga
     * kirishni yopib qo'yadi va foydalanuvchi sababini ko'rmaydi.
     */
    it('tashkilotlar ro’yxati kelmasa ham kirish tugmasi ochiq qoladi', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockImplementation((url: string) =>
                Promise.resolve({
                    ok: !String(url).includes('/organization/name'),
                    status: String(url).includes('/organization/name') ? 401 : 200,
                    text: () => Promise.resolve(JSON.stringify({ token: tokenWithRole('TEACHER') })),
                    json: () => Promise.resolve({ token: tokenWithRole('TEACHER') }),
                })
            )
        )

        renderWithProviders(<LoginForm onLoggedIn={vi.fn()} />)

        await waitFor(() =>
            expect(screen.getByRole('button', { name: /kirish/i })).toBeEnabled()
        )
    })

    it('telefon va parolni yuboradi, sessiyani qaytaradi', async () => {
        const user = userEvent.setup()
        mockLoginResponse({ token: tokenWithRole('ADMINISTRATOR') })
        const onLoggedIn = vi.fn()

        renderWithProviders(<LoginForm onLoggedIn={onLoggedIn} />)

        await user.type(screen.getByLabelText(/telefon raqami/i), '+998901234567')
        await user.type(screen.getByLabelText(/parol/i), 'secret')
        await user.click(screen.getByRole('button', { name: /kirish/i }))

        await waitFor(() => expect(onLoggedIn).toHaveBeenCalledTimes(1))
        expect(onLoggedIn.mock.calls[0][0]).toMatchObject({ role: 'ADMINISTRATOR' })
    })

    it('"Keep me signed in" holatini so’rovga qo’shadi', async () => {
        const user = userEvent.setup()
        mockLoginResponse({ token: tokenWithRole('TEACHER') })

        renderWithProviders(<LoginForm onLoggedIn={vi.fn()} />)

        await user.type(screen.getByLabelText(/telefon raqami/i), '+998901234567')
        await user.type(screen.getByLabelText(/parol/i), 'secret')
        await user.click(screen.getByLabelText(/meni eslab qol/i))
        await user.click(screen.getByRole('button', { name: /kirish/i }))

        await waitFor(() => expect(loginRequestBody()).toMatchObject({ rememberMe: true }))
    })

    // Backendda `organizationId` @NotBlank — yuborilmasa login 400 bo'ladi.
    // Bitta tashkilot bo'lganda foydalanuvchi hech nima tanlamaydi, shuning
    // uchun forma uni o'zi qo'yishi kerak.
    it('bitta tashkilot bo’lsa uni o’zi tanlab yuboradi', async () => {
        const user = userEvent.setup()
        mockLoginResponse({ token: tokenWithRole('ADMINISTRATOR') })

        renderWithProviders(<LoginForm onLoggedIn={vi.fn()} />)

        await user.type(screen.getByLabelText(/telefon raqami/i), '+998901234567')
        await user.type(screen.getByLabelText(/parol/i), 'secret')
        await user.click(screen.getByRole('button', { name: /kirish/i }))

        await waitFor(() => expect(loginRequestBody()).toMatchObject({ organizationId: 'org-1' }))
    })

    it('noto’g’ri ma’lumotda xato xabarini ko’rsatadi', async () => {
        const user = userEvent.setup()
        mockLoginResponse({ message: "Telefon raqami yoki parol noto'g'ri" }, false, 401)
        const onLoggedIn = vi.fn()

        renderWithProviders(<LoginForm onLoggedIn={onLoggedIn} />)

        await user.type(screen.getByLabelText(/telefon raqami/i), '+998900000000')
        await user.type(screen.getByLabelText(/parol/i), 'wrong')
        await user.click(screen.getByRole('button', { name: /kirish/i }))

        expect(await screen.findByRole('alert')).toHaveTextContent(/noto’g’ri|noto'g'ri/i)
        expect(onLoggedIn).not.toHaveBeenCalled()
    })

    // Token kelgan, lekin ichida rol yo'q — bunda dashboard tanlab bo'lmaydi.
    it('tokenda rol bo’lmasa kirishga ruxsat bermaydi', async () => {
        const user = userEvent.setup()
        const encode = (value: object) => btoa(JSON.stringify(value)).replace(/=+$/, '')
        mockLoginResponse({ token: `${encode({ alg: 'HS256' })}.${encode({ sub: '1' })}.sig` })
        const onLoggedIn = vi.fn()

        renderWithProviders(<LoginForm onLoggedIn={onLoggedIn} />)

        await user.type(screen.getByLabelText(/telefon raqami/i), '+998901234567')
        await user.type(screen.getByLabelText(/parol/i), 'secret')
        await user.click(screen.getByRole('button', { name: /kirish/i }))

        expect(await screen.findByRole('alert')).toHaveTextContent(/rol/i)
        expect(onLoggedIn).not.toHaveBeenCalled()
    })
})
