import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchMyStudent } from './studentApi'

function mockFetch(text: string) {
    const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(text),
        json: () => Promise.resolve(JSON.parse(text || '{}')),
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

beforeEach(() => vi.unstubAllGlobals())
afterEach(() => vi.restoreAllMocks())

describe('fetchMyStudent', () => {
    // Ilgari bu ma'lumot `/student/phone?phone=…` dan olinardi — u endpoint
    // adminlar uchun va o'quvchiga 403 qaytarardi.
    it('o‘quvchining o‘z yozuvini `/student/me` dan oladi', async () => {
        const fetchMock = mockFetch('{"id":"st-1","parentPhone":"+998901112233"}')

        const student = await fetchMyStudent('fake-token')

        expect(String(fetchMock.mock.calls[0][0])).toBe('/api/v1/student/me')
        expect(student?.id).toBe('st-1')
    })

    it('telefon raqamini so‘rov parametriga qo‘shmaydi', async () => {
        const fetchMock = mockFetch('{"id":"st-1"}')

        await fetchMyStudent('fake-token')

        expect(String(fetchMock.mock.calls[0][0])).not.toContain('phone')
    })
})
