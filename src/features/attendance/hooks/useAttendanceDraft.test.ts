import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { LessonDto, StudentDto } from '@/shared/types'
import { useAttendanceDraft } from './useAttendanceDraft'

const students: StudentDto[] = [
    { id: 's1', userDto: { fullName: 'Aziza Karimova' } },
    { id: 's2', userDto: { fullName: 'Bek Toshev' } },
    { id: 's3', userDto: { fullName: 'Dilnoza Yusupova' } },
]

const lesson: LessonDto = { id: 'l1', lessonNumber: '4', lessonDate: '2026-03-14T09:00:00' }

describe('useAttendanceDraft', () => {
    it('faol dars bo’lmasa qoralama yo’q', () => {
        const { result } = renderHook(() => useAttendanceDraft(students, null))
        expect(result.current.draft).toBeNull()
        expect(result.current.hasDraft).toBe(false)
    })

    it('ro’yxat bo’sh bo’lsa qoralama ochilmaydi', () => {
        const { result } = renderHook(() => useAttendanceDraft([], lesson))
        expect(result.current.draft).toBeNull()
    })

    it('dars boshlanganda hammani PRESENT qilib belgilaydi', () => {
        const { result } = renderHook(() => useAttendanceDraft(students, lesson))
        expect(result.current.draft?.statuses).toEqual({ s1: 'PRESENT', s2: 'PRESENT', s3: 'PRESENT' })
        expect(result.current.counts.PRESENT).toBe(3)
    })

    it('bitta o’quvchi statusini o’zgartiradi va sanoqni yangilaydi', () => {
        const { result } = renderHook(() => useAttendanceDraft(students, lesson))

        act(() => result.current.setStatus('s2', 'ABSENT'))

        expect(result.current.draft?.statuses.s2).toBe('ABSENT')
        expect(result.current.counts).toMatchObject({ PRESENT: 2, ABSENT: 1, LATE: 0, EXCUSED: 0 })
    })

    it('boshqa darsga o’tilganda o’zgarishlar tashlab yuboriladi', () => {
        const { result, rerender } = renderHook(
            ({ activeLesson }) => useAttendanceDraft(students, activeLesson),
            { initialProps: { activeLesson: lesson } }
        )

        act(() => result.current.setStatus('s1', 'LATE'))
        expect(result.current.draft?.statuses.s1).toBe('LATE')

        rerender({ activeLesson: { id: 'l2', lessonNumber: '5' } })

        expect(result.current.draft?.lesson.id).toBe('l2')
        expect(result.current.draft?.statuses.s1).toBe('PRESENT')
    })

    it('yuborilgandan keyin o’sha dars uchun qoralama qayta ochilmaydi', () => {
        const { result } = renderHook(() => useAttendanceDraft(students, lesson))

        act(() => result.current.clearDraft())

        expect(result.current.draft).toBeNull()
        expect(result.current.hasDraft).toBe(false)
    })

    it('yuborish uchun backend kutgan shaklni yasaydi', () => {
        const { result } = renderHook(() => useAttendanceDraft(students, lesson))

        act(() => result.current.setStatus('s3', 'EXCUSED'))

        expect(result.current.toPayload()).toEqual({
            lessonId: 'l1',
            students: [
                { studentId: 's1', status: 'PRESENT' },
                { studentId: 's2', status: 'PRESENT' },
                { studentId: 's3', status: 'EXCUSED' },
            ],
        })
    })

    it('qoralama yo’q bo’lsa yuboriladigan yuk ham yo’q', () => {
        const { result } = renderHook(() => useAttendanceDraft(students, null))
        expect(result.current.toPayload()).toBeNull()
    })
})
