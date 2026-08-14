import { describe, expect, it } from 'vitest'
import { endOfDay, startOfDay } from './dateRange'

describe('dateRange', () => {
    it('boshlanish sanasini kun boshiga qo’yadi', () => {
        expect(startOfDay('2026-08-01')).toBe('2026-08-01T00:00:00')
    })

    // Oxirgi kun ham qamrab olinsin: 23:59:59 bo'lmasa o'sha kungi
    // hisoblar ro'yxatga tushmay qolardi.
    it('tugash sanasini kun oxiriga qo’yadi', () => {
        expect(endOfDay('2026-08-05')).toBe('2026-08-05T23:59:59')
    })

    it('bo’sh sanani yubormaydi', () => {
        expect(startOfDay('')).toBeUndefined()
        expect(endOfDay('')).toBeUndefined()
    })
})
