import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiFetch } from './httpClient'
import { setTokenRefresher } from './sessionRefresh'

/**
 * Ketma-ket javob qaytaradigan soxta `fetch`: birinchi chaqiruvda 403,
 * keyingisida muvaffaqiyat — token eskirishi shunday ko'rinadi.
 */
function mockFetchSequence(responses: { status: number; text?: string }[]) {
    let call = 0
    const fetchMock = vi.fn().mockImplementation(() => {
        const next = responses[Math.min(call, responses.length - 1)]
        call += 1
        return Promise.resolve({
            ok: next.status >= 200 && next.status < 300,
            status: next.status,
            text: () => Promise.resolve(next.text ?? ''),
            json: () => Promise.resolve(JSON.parse(next.text || '{}')),
        })
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

beforeEach(() => {
    vi.unstubAllGlobals()
    setTokenRefresher(null)
})
afterEach(() => {
    setTokenRefresher(null)
    vi.restoreAllMocks()
})

describe('eskirgan token', () => {
    it('403 dan keyin tokenni yangilab so’rovni qaytaradi', async () => {
        const fetchMock = mockFetchSequence([{ status: 403 }, { status: 200, text: '{"id":"1"}' }])
        setTokenRefresher(async () => 'yangi-token')

        const data = await apiFetch<{ id: string }>('/student', { token: 'eski-token' })

        expect(data).toEqual({ id: '1' })
        expect(fetchMock).toHaveBeenCalledTimes(2)
        expect(fetchMock.mock.calls[0][1].headers).toMatchObject({
            Authorization: 'Bearer eski-token',
        })
        expect(fetchMock.mock.calls[1][1].headers).toMatchObject({
            Authorization: 'Bearer yangi-token',
        })
    })

    it('401 uchun ham ishlaydi', async () => {
        const fetchMock = mockFetchSequence([{ status: 401 }, { status: 200, text: '{}' }])
        setTokenRefresher(async () => 'yangi-token')

        await apiFetch('/student', { token: 'eski-token' })
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    // Aks holda `refresh-token` yiqilganda o'zini cheksiz chaqirardi.
    it('/auth yo’llarini qaytadan yubormaydi', async () => {
        const fetchMock = mockFetchSequence([{ status: 403 }])
        const refresher = vi.fn().mockResolvedValue('yangi-token')
        setTokenRefresher(refresher)

        await expect(apiFetch('/auth/refresh-token', { token: 'eski' })).rejects.toThrow()
        expect(refresher).not.toHaveBeenCalled()
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    // Tokensiz so'rovga yangi token yordam bermaydi.
    it('token berilmagan so’rovni qaytadan yubormaydi', async () => {
        const fetchMock = mockFetchSequence([{ status: 403 }])
        const refresher = vi.fn().mockResolvedValue('yangi-token')
        setTokenRefresher(refresher)

        await expect(apiFetch('/student')).rejects.toThrow()
        expect(refresher).not.toHaveBeenCalled()
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it('yangilash ham yiqilsa xatoni chaqiruvchiga uzatadi', async () => {
        mockFetchSequence([{ status: 403 }])
        setTokenRefresher(async () => null)

        await expect(apiFetch('/student', { token: 'eski' })).rejects.toMatchObject({ status: 403 })
    })

    // Admin paneli ochilishida sakkizta so'rov barobar 403 bo'ladi —
    // ularning hammasi bitta yangilashni kutishi kerak.
    it('bir vaqtda kelgan so’rovlar bitta yangilashni bo’lishadi', async () => {
        mockFetchSequence([{ status: 403 }, { status: 200, text: '{}' }])
        const refresher = vi.fn().mockResolvedValue('yangi-token')
        setTokenRefresher(refresher)

        await Promise.all([
            apiFetch('/student', { token: 'eski' }),
            apiFetch('/teacher', { token: 'eski' }),
            apiFetch('/group', { token: 'eski' }),
        ])

        expect(refresher).toHaveBeenCalledTimes(1)
    })
})
