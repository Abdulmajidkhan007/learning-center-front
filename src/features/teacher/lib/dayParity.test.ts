import { describe, expect, it } from 'vitest'
import type { GroupDto } from '@/shared/types'
import { dayParity, groupMatchesFilter } from './dayParity'

const oddGroup: GroupDto = {
    id: 'g1',
    name: 'Odd',
    timeTable: { days: ['MONDAY', 'WEDNESDAY', 'FRIDAY'] },
}
const evenGroup: GroupDto = {
    id: 'g2',
    name: 'Even',
    timeTable: { days: ['TUESDAY', 'THURSDAY', 'SATURDAY'] },
}
const noSchedule: GroupDto = { id: 'g3', name: 'No timetable' }

describe('dayParity', () => {
    it('dushanba, chorshanba, juma — toq kunlar', () => {
        expect(dayParity('MONDAY')).toBe('odd')
        expect(dayParity('WEDNESDAY')).toBe('odd')
        expect(dayParity('FRIDAY')).toBe('odd')
    })

    it('seshanba, payshanba, shanba — juft kunlar', () => {
        expect(dayParity('TUESDAY')).toBe('even')
        expect(dayParity('THURSDAY')).toBe('even')
        expect(dayParity('SATURDAY')).toBe('even')
    })
})

describe('groupMatchesFilter', () => {
    it('"all" filtri hamma guruhni o’tkazadi', () => {
        expect(groupMatchesFilter(oddGroup, 'all')).toBe(true)
        expect(groupMatchesFilter(noSchedule, 'all')).toBe(true)
    })

    it('toq va juft guruhlarni ajratadi', () => {
        expect(groupMatchesFilter(oddGroup, 'odd')).toBe(true)
        expect(groupMatchesFilter(oddGroup, 'even')).toBe(false)
        expect(groupMatchesFilter(evenGroup, 'even')).toBe(true)
        expect(groupMatchesFilter(evenGroup, 'odd')).toBe(false)
    })

    it('aralash jadval ikkala filtrga ham tushadi', () => {
        const mixed: GroupDto = { id: 'g4', timeTable: { days: ['MONDAY', 'THURSDAY'] } }
        expect(groupMatchesFilter(mixed, 'odd')).toBe(true)
        expect(groupMatchesFilter(mixed, 'even')).toBe(true)
    })

    // Jadvalsiz guruh ikkala ro'yxatda ham chiqsa chalkashtiradi.
    it('jadvali yo’q guruh toq/juft filtriga tushmaydi', () => {
        expect(groupMatchesFilter(noSchedule, 'odd')).toBe(false)
        expect(groupMatchesFilter(noSchedule, 'even')).toBe(false)
    })
})
