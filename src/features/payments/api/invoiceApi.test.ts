import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
    createInvoice,
    deleteInvoice,
    fetchInvoices,
    fetchStudentOptions,
    returnInvoice,
    updateInvoiceStatus,
} from './invoiceApi'

/**
 * `httpClient.test.ts` dagi kabi — global `fetch` soxtalashtiriladi,
 * `apiFetch` ning o'zi allaqachon sinalgan, shuning uchun bu yerda faqat
 * to'g'ri yo'l/metod/parametr yuborilishini tekshiramiz.
 */
interface FakeResponse {
    ok?: boolean
    status?: number
    text?: string
}

function mockFetch({ ok = true, status = 200, text = '' }: FakeResponse) {
    const fetchMock = vi.fn().mockResolvedValue({
        ok,
        status,
        text: () => Promise.resolve(text),
        json: () => Promise.resolve(JSON.parse(text || '{}')),
    })
    vi.stubGlobal('fetch', fetchMock)
    return fetchMock
}

beforeEach(() => vi.unstubAllGlobals())
afterEach(() => vi.restoreAllMocks())

const TOKEN = 'tok'

describe('fetchInvoices', () => {
    it('to‘g‘ri yo‘l va query parametrlarini yuboradi', async () => {
        const fetchMock = mockFetch({ text: '{"content":[],"totalElements":0}' })
        await fetchInvoices(TOKEN, { page: 0, size: 10 })
        expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/invoice?page=0&size=10')
        expect(fetchMock.mock.calls[0][1].method).toBeUndefined()
    })

    it('bo‘sh va undefined qiymatlarni query’dan tushirib qoldiradi', async () => {
        const fetchMock = mockFetch({ text: '{}' })
        await fetchInvoices(TOKEN, { page: 0, size: 10, search: '', status: '', from: undefined })
        expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/invoice?page=0&size=10')
    })

    it('javobni Page shaklida qaytaradi', async () => {
        mockFetch({ text: '{"content":[{"id":"1"}],"totalElements":1}' })
        const result = await fetchInvoices(TOKEN, { page: 0, size: 10 })
        expect(result).toEqual({ content: [{ id: '1' }], totalElements: 1 })
    })
})

describe('createInvoice', () => {
    it('POST /invoice ga body yuboradi', async () => {
        const fetchMock = mockFetch({ text: '{"id":"1"}' })
        await createInvoice(TOKEN, { studentId: 's1', amount: 100 })
        expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/invoice')
        expect(fetchMock.mock.calls[0][1].method).toBe('POST')
        expect(fetchMock.mock.calls[0][1].body).toBe('{"studentId":"s1","amount":100}')
    })
})

describe('updateInvoiceStatus', () => {
    it('PUT /invoice/{id} ga faqat status yuboradi', async () => {
        const fetchMock = mockFetch({ text: '{"id":"1"}' })
        await updateInvoiceStatus(TOKEN, '1', 'PAID')
        expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/invoice/1')
        expect(fetchMock.mock.calls[0][1].method).toBe('PUT')
        expect(fetchMock.mock.calls[0][1].body).toBe('{"status":"PAID"}')
    })
})

describe('deleteInvoice', () => {
    it('DELETE /invoice/{id} yuboradi', async () => {
        const fetchMock = mockFetch({ text: '' })
        await deleteInvoice(TOKEN, '1')
        expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/invoice/1')
        expect(fetchMock.mock.calls[0][1].method).toBe('DELETE')
    })
})

describe('returnInvoice', () => {
    it('POST /invoice/return ga studentId ni query sifatida yuboradi, body yo‘q', async () => {
        const fetchMock = mockFetch({ text: '{"id":"1"}' })
        await returnInvoice(TOKEN, 's1')
        expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/invoice/return?studentId=s1')
        expect(fetchMock.mock.calls[0][1].method).toBe('POST')
        expect(fetchMock.mock.calls[0][1].body).toBeUndefined()
    })
})

describe('fetchStudentOptions', () => {
    it('/student ga sahifalash parametrlarini yuborib, {value,label} ro‘yxatiga o‘giradi', async () => {
        const fetchMock = mockFetch({
            text: '{"content":[{"id":"s1","userDto":{"fullName":"Ali Valiyev"}}]}',
        })
        const options = await fetchStudentOptions(TOKEN)
        expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/student?page=0&size=200')
        expect(options).toEqual([{ value: 's1', label: 'Ali Valiyev' }])
    })

    it('fullName bo‘lmasa id ni label sifatida ishlatadi', async () => {
        mockFetch({ text: '{"content":[{"id":"s2","userDto":{}}]}' })
        const options = await fetchStudentOptions(TOKEN)
        expect(options).toEqual([{ value: 's2', label: 's2' }])
    })

    it('javob bo‘sh bo‘lsa bo‘sh ro‘yxat qaytaradi', async () => {
        mockFetch({ text: '' })
        const options = await fetchStudentOptions(TOKEN)
        expect(options).toEqual([])
    })
})
