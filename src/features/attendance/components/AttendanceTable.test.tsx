import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AttendanceTable, type PastLessonColumn } from './AttendanceTable'
import type { StudentDto } from '@/shared/types'

const students: StudentDto[] = [
    { id: 's1', userDto: { fullName: 'Aziza Karimova' } },
    { id: 's2', userDto: { fullName: 'Bekzod Yusupov' } },
]

const pastColumns: PastLessonColumn[] = [
    {
        lessonId: 'l1',
        lessonTitle: '1-dars',
        date: '2026-08-01',
        // s2 xaritada yo'q — hali belgilanmagan, "kelmadi" EMAS.
        attendanceMap: { s1: { status: 'ABSENT' } },
    },
]

const pastColumnsWithReason: PastLessonColumn[] = [
    {
        lessonId: 'l1',
        lessonTitle: '1-dars',
        date: '2026-08-01',
        attendanceMap: { s1: { status: 'EXCUSED', reason: 'Kasal' } },
    },
]

describe('AttendanceTable', () => {
    it("xaritada bo'lgan o'quvchining katagida status nishoni chiqadi", () => {
        renderWithProviders(<AttendanceTable students={students} pastColumns={pastColumns} />)

        const row = screen.getByRole('row', { name: /aziza karimova/i })
        const cells = within(row).getAllByRole('cell')

        expect(cells[1]).toHaveTextContent('A')
    })

    it("xaritada bo'lmagan o'quvchining katagi bo'sh qoladi", () => {
        renderWithProviders(<AttendanceTable students={students} pastColumns={pastColumns} />)

        const row = screen.getByRole('row', { name: /bekzod yusupov/i })
        const cells = within(row).getAllByRole('cell')

        expect(cells[1]).toBeEmptyDOMElement()
    })

    it("sababi bor katakda title atributida sabab matni chiqadi", () => {
        renderWithProviders(<AttendanceTable students={students} pastColumns={pastColumnsWithReason} />)

        const row = screen.getByRole('row', { name: /aziza karimova/i })
        const cells = within(row).getAllByRole('cell')

        expect(cells[1].querySelector('[title="Kasal"]')).toBeInTheDocument()
    })
})
