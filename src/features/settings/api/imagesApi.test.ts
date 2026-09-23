import { afterEach, describe, expect, it, vi } from 'vitest'
import { getImages } from './imagesApi'

function mockFetch(payload: unknown) {
    vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            text: () => Promise.resolve(JSON.stringify(payload)),
            json: () => Promise.resolve(payload),
        })
    )
}

afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
})

describe('getImages', () => {
    /*
     * `GET /image` massiv qaytaradi. Ilgari bu yerda `Page` kutilar edi va
     * `content` doim `undefined` chiqardi — yuklangan rasm galereyada
     * ko'rinmasdi, lekin xato ham chiqmasdi.
     */
    it('massivni shundoq qaytaradi', async () => {
        mockFetch([{ id: 'i-1', imageUrl: 'https://example.test/a.jpg' }])

        await expect(getImages(undefined, 'token')).resolves.toHaveLength(1)
    })

    // Backend keyin sahifalashga o'tsa ekran jimgina bo'shab qolmasin.
    it('sahifalangan javobdan ham ro‘yxatni oladi', async () => {
        mockFetch({ content: [{ id: 'i-1' }, { id: 'i-2' }], totalPages: 1 })

        await expect(getImages(undefined, 'token')).resolves.toHaveLength(2)
    })

    it('bo‘sh javobda bo‘sh ro‘yxat', async () => {
        mockFetch(null)

        await expect(getImages(undefined, 'token')).resolves.toEqual([])
    })
})
