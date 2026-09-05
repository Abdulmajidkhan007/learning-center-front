import { describe, expect, it } from 'vitest'
import { toCreateGroupLevelPayload, toUpdateGroupLevelPayload } from './groupLevelPayload'

describe('group level payloads', () => {
    it('creates DTO without id and with numeric fields coerced', () => {
        expect(
            toCreateGroupLevelPayload({
                name: 'B1',
                lessonCount: '20',
                orderNumber: '2',
                durationInMonths: '4',
                monthlyFee: '',
            })
        ).toEqual({
            name: 'B1',
            lessonCount: 20,
            orderNumber: 2,
            durationInMonths: 4,
        })
    })

    it('builds the update DTO without name and orderNumber', () => {
        expect(
            toUpdateGroupLevelPayload({
                id: 'lvl-2',
                name: 'B2',
                lessonCount: '24',
                orderNumber: '3',
                durationInMonths: '6',
                monthlyFee: '450000',
            })
        ).toEqual({
            lessonCount: 24,
            durationInMonths: 6,
            monthlyFee: 450000,
        })
    })
})
