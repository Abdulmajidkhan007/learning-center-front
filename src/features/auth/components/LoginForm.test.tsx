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

function mockLoginResponse(body: object, ok = true, status = 200) {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok,
            status,
            text: () => Promise.resolve(JSON.stringify(body)),
            json: () => Promise.resolve(body),
        })
    )
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('LoginForm', () => {
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

        await waitFor(() => expect(fetch).toHaveBeenCalled())
        const [, init] = vi.mocked(fetch).mock.calls[0]
        expect(JSON.parse(String(init?.body))).toMatchObject({ rememberMe: true })
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
