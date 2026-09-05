import { describe, expect, it } from 'vitest'
import { formatAmount, formatCell, formatDate, formatHeader, formatTime, initials, singular, titleCase } from './format'

/** `Intl` razryadlarni uzuq bo'shliq (U+00A0) bilan ajratadi. */
const normalizeAmount = (value: string) => value.replace(/\u00a0/g, ' ')

describe('formatTime', () => {
    it('LocalTime dan soniyalarni olib tashlaydi', () => {
        expect(formatTime('09:30:00')).toBe('09:30')
    })

    it('bo’sh qiymatda bo’sh satr qaytaradi', () => {
        expect(formatTime(undefined)).toBe('')
        expect(formatTime(null)).toBe('')
        expect(formatTime('')).toBe('')
    })
})

describe('formatDate', () => {
    it('ISO datetime dan faqat sanani oladi', () => {
        expect(formatDate('2026-03-14T08:12:45.123Z')).toBe('2026-03-14')
    })
})

describe('initials', () => {
    it('ikkita bosh harf oladi', () => {
        expect(initials('Aziza Karimova')).toBe('AK')
    })

    it('uchinchi so’zni e’tiborsiz qoldiradi', () => {
        expect(initials('Ali Vali Hasan')).toBe('AV')
    })

    it('ortiqcha bo’shliqlarga chidaydi', () => {
        expect(initials('  Aziza   Karimova ')).toBe('AK')
    })

    it('ism yo’q bo’lsa savol belgisi', () => {
        expect(initials(undefined)).toBe('?')
        expect(initials('')).toBe('?')
    })
})

describe('formatHeader', () => {
    it('camelCase ni bo’sh joy bilan ajratadi va bosh harf qiladi', () => {
        expect(formatHeader('parentPhone')).toBe('Parent Phone')
        expect(formatHeader('name')).toBe('Name')
        expect(formatHeader('lessonNumber')).toBe('Lesson Number')
    })
})

describe('formatCell', () => {
    it('bo’sh qiymatni tire bilan ko’rsatadi', () => {
        expect(formatCell(null)).toBe('—')
        expect(formatCell(undefined)).toBe('—')
    })

    it('boolean ni Yes/No ga aylantiradi', () => {
        expect(formatCell(true)).toBe('Yes')
        expect(formatCell(false)).toBe('No')
    })

    it('obyektni JSON qilib ko’rsatadi', () => {
        expect(formatCell({ id: 1 })).toBe('{"id":1}')
    })

    it('nolni tire deb hisoblamaydi', () => {
        expect(formatCell(0)).toBe('0')
    })
})

describe('titleCase / singular', () => {
    it('statusni o’qiladigan holga keltiradi', () => {
        expect(titleCase('PRESENT')).toBe('Present')
    })

    it('ko’plikdan birlikka o’tadi', () => {
        expect(singular('Students')).toBe('Student')
        expect(singular('Group')).toBe('Group')
    })
})

describe('formatAmount', () => {
    it('razryadlarga ajratadi', () => {
        expect(normalizeAmount(formatAmount(450000))).toBe('450 000')
    })

    it('kasr qismini saqlaydi', () => {
        expect(normalizeAmount(formatAmount(1234.5))).toBe('1 234,5')
    })

    // Backend `amount`/`monthlyFee` ni bermasligi mumkin — jadval bo'sh katak ko'rsatsin.
    it('qiymat yo’q bo’lsa chiziqcha', () => {
        expect(formatAmount(undefined)).toBe('—')
        expect(formatAmount(null)).toBe('—')
    })

    it('nolni chiziqcha deb hisoblamaydi', () => {
        expect(formatAmount(0)).toBe('0')
    })
})
