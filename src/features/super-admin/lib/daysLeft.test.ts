import { describe, expect, it } from 'vitest'
import { daysLeft } from './daysLeft'

describe('daysLeft', () => {
    const now = new Date('2026-09-17T15:00:00Z')

    it('qolgan kunlarni sanaydi', () => {
        expect(daysLeft('2026-09-20T00:00:00Z', now)).toBe(3)
    })

    // Soat bo'yicha sanasak, bugun tugaydigan obuna "0 kun" emas, "-1"
    // yoki "9 soat" bo'lib chiqardi — foydalanuvchi kun bilan o'ylaydi.
    it('o’sha kuni tugasa nol qaytaradi', () => {
        expect(daysLeft('2026-09-17T09:00:00Z', now)).toBe(0)
    })

    it('muddat o’tgan bo’lsa manfiy qaytaradi', () => {
        expect(daysLeft('2026-09-10T00:00:00Z', now)).toBe(-7)
    })

    it('sana bo’lmasa null', () => {
        expect(daysLeft(undefined, now)).toBeNull()
    })
})
