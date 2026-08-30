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
            })
        ).toEqual({
            name: 'B1',
            lessonCount: 20,
            orderNumber: 2,
            durationInMonths: 4,
        })
    })

    it('updates the existing record with id in the body', () => {
        expect(
            toUpdateGroupLevelPayload({
                id: 'lvl-2',
                name: 'B2',
                lessonCount: '24',
                orderNumber: '3',
                durationInMonths: '6',
            })
        ).toEqual({
            id: 'lvl-2',
            name: 'B2',
            lessonCount: 24,
            orderNumber: 3,
            durationInMonths: 6,
        })
    })
})
