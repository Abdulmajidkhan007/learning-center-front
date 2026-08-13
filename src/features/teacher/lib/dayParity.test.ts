import { describe, expect, it } from 'vitest'
import type { GroupNameDto } from '@/shared/types'
import { canFilterByDayType, groupMatchesFilter } from './dayParity'

const odd: GroupNameDto = { id: 'g1', name: 'Beginners A', dayType: 'ODD' }
const even: GroupNameDto = { id: 'g2', name: 'Intermediate B', dayType: 'EVEN' }
/** `GET /group/groups` hozir aynan shunday — `dayType` siz — qaytaradi. */
const unknownType: GroupNameDto = { id: 'g3', name: 'IELTS' }

describe('groupMatchesFilter', () => {
    it('"all" hamma guruhni o’tkazadi', () => {
        expect(groupMatchesFilter(odd, 'all')).toBe(true)
        expect(groupMatchesFilter(unknownType, 'all')).toBe(true)
    })

    it('toq va juft guruhlarni ajratadi', () => {
        expect(groupMatchesFilter(odd, 'ODD')).toBe(true)
        expect(groupMatchesFilter(odd, 'EVEN')).toBe(false)
        expect(groupMatchesFilter(even, 'EVEN')).toBe(true)
        expect(groupMatchesFilter(even, 'ODD')).toBe(false)
    })

    it('dayType noma’lum guruh aniq filtrga tushmaydi', () => {
        expect(groupMatchesFilter(unknownType, 'ODD')).toBe(false)
        expect(groupMatchesFilter(unknownType, 'EVEN')).toBe(false)
    })
})

describe('canFilterByDayType', () => {
    // Backend proyeksiyasi dayType bermaguncha filtrni ko'rsatishning ma'nosi
    // yo'q — u hamma guruhni yashirib qo'yardi.
    it('hech bir guruhda dayType bo’lmasa filtr yashiriladi', () => {
        expect(canFilterByDayType([unknownType])).toBe(false)
        expect(canFilterByDayType([])).toBe(false)
    })

    it('bittasida bo’lsa ham filtr ko’rsatiladi', () => {
        expect(canFilterByDayType([unknownType, odd])).toBe(true)
    })
})
