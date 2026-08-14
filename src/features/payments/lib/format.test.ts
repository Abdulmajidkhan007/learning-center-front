import { describe, expect, it } from 'vitest'
import { formatAmount } from './format'

/** `Intl` razryadlarni uzuq bo'shliq (U+00A0) bilan ajratadi. */
const normalize = (value: string) => value.replace(/\u00a0/g, ' ')

describe('formatAmount', () => {
    it('razryadlarga ajratadi', () => {
        expect(normalize(formatAmount(450000))).toBe('450 000')
    })

    it('kasr qismini saqlaydi', () => {
        expect(normalize(formatAmount(1234.5))).toBe('1 234,5')
    })

    // Backend `amount` ni bermasligi mumkin — jadval bo'sh katak ko'rsatsin.
    it('qiymat yo’q bo’lsa chiziqcha', () => {
        expect(formatAmount(undefined)).toBe('—')
        expect(formatAmount(null)).toBe('—')
    })

    it('nolni chiziqcha deb hisoblamaydi', () => {
        expect(formatAmount(0)).toBe('0')
    })
})
