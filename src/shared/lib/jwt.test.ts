import { describe, expect, it } from 'vitest'
import { decodeJwt } from './jwt'

/**
 * Test uchun imzosiz JWT yasaydi (imzo baribir tekshirilmaydi).
 *
 * `btoa` faqat Latin-1 ni biladi, shuning uchun avval UTF-8 ga o'tkazamiz —
 * backend ham tokenni aynan shunday kodlaydi.
 */
function makeToken(payload: Record<string, unknown>): string {
    const encode = (value: object) => {
        const utf8 = new TextEncoder().encode(JSON.stringify(value))
        const binary = String.fromCharCode(...utf8)
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }
    return `${encode({ alg: 'HS256' })}.${encode(payload)}.signature`
}

describe('decodeJwt', () => {
    it('payload dagi rolni o’qiydi', () => {
        expect(decodeJwt(makeToken({ role: 'TEACHER', sub: '42' }))).toMatchObject({
            role: 'TEACHER',
            sub: '42',
        })
    })

    it('base64url belgilari va lotin bo’lmagan harflarni to’g’ri ochadi', () => {
        const claims = decodeJwt(makeToken({ role: 'ADMINISTRATOR', name: 'Аziza — Karimova' }))
        expect(claims?.name).toBe('Аziza — Karimova')
    })

    it('buzuq token uchun null qaytaradi, xato otmaydi', () => {
        expect(decodeJwt('not-a-token')).toBeNull()
        expect(decodeJwt('')).toBeNull()
        expect(decodeJwt('a.b.c')).toBeNull()
    })
})
