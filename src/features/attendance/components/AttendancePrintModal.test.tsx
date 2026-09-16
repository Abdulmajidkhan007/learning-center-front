import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AttendancePrintModal } from './AttendancePrintModal'
import type { PastLessonColumn } from '@/shared/ui'

vi.mock('@/app/providers/useAuth', () => ({
    useSession: () => ({
        token: 'test-token',
        role: 'TEACHER',
        claims: { organizationId: 'org-123' },
    }),
}))

const useMyOrganizationMock = vi.fn()
vi.mock('@/shared/hooks', async () => {
    const actual = await vi.importActual('@/shared/hooks')
    return {
        ...actual,
        useMyOrganization: (...args: unknown[]) => useMyOrganizationMock(...args),
    }
})
import type { AttendanceDraft } from '../hooks/useAttendanceDraft'
import type { StudentDto } from '@/shared/types'

const mockStudents: StudentDto[] = [
    {
        id: 'student-1',
        userDto: {
            fullName: 'Anvar Karimov',
        },
    },
    {
        id: 'student-2',
        userDto: {
            fullName: 'Malika Sobirova',
        },
    },
]

const mockPastColumns: PastLessonColumn[] = [
    {
        lessonId: 'lesson-1',
        lessonTitle: '1-dars',
        date: '2026-03-01',
        attendanceMap: {
            'student-1': { status: 'PRESENT' },
            'student-2': { status: 'ABSENT' },
        },
    },
    {
        lessonId: 'lesson-2',
        lessonTitle: '2-dars',
        date: '2026-03-03',
        attendanceMap: {
            'student-1': { status: 'EXCUSED', reason: 'Kasal' },
            'student-2': { status: 'PRESENT' },
        },
    },
]

describe('AttendancePrintModal', () => {
    it('tashkilot nomi yuklanganda haqiqiy markaz nomini ko‘rsatadi', () => {
        useMyOrganizationMock.mockReturnValue({
            data: { id: 'org-123', name: 'Alia Education Center' },
        })

        renderWithProviders(
            <AttendancePrintModal
                students={mockStudents}
                pastColumns={mockPastColumns}
                groupName="Frontend-101"
                monthLabel="Joriy oy"
                onClose={vi.fn()}
            />
        )

        expect(screen.getByText('Alia Education Center')).toBeInTheDocument()
    })

    it('tashkilot nomi yuklanmaganda fallback matn ko‘rsatiladi va sarlavha bo‘sh qolmaydi', () => {
        useMyOrganizationMock.mockReturnValue({
            data: undefined,
        })

        renderWithProviders(
            <AttendancePrintModal
                students={mockStudents}
                pastColumns={mockPastColumns}
                groupName="Frontend-101"
                monthLabel="Joriy oy"
                onClose={vi.fn()}
            />
        )

        expect(screen.getByText(/O'QUV MARKAZI|O‘QUV MARKAZI/i)).toBeInTheDocument()
    })

    it("o'quvchilar ismi, guruh nomi, oy, belgilar va imzo joyini ko'rsatadi", () => {
        useMyOrganizationMock.mockReturnValue({
            data: { id: 'org-123', name: 'Alia Education Center' },
        })
        renderWithProviders(
            <AttendancePrintModal
                students={mockStudents}
                pastColumns={mockPastColumns}
                groupName="Frontend-101"
                monthLabel="Joriy oy"
                onClose={vi.fn()}
            />
        )

        expect(screen.getByText('Anvar Karimov')).toBeInTheDocument()
        expect(screen.getByText('Malika Sobirova')).toBeInTheDocument()
        expect(screen.getByText('Frontend-101')).toBeInTheDocument()
        expect(screen.getByText('Joriy oy')).toBeInTheDocument()
        expect(screen.getAllByText(/DAVOMAT JURNALI/i).length).toBeGreaterThan(0)
        expect(screen.getByText(/O'qituvchi imzosi/i)).toBeInTheDocument()

        // Belgilar: + (kelgan), − (kelmagan), S (sababli)
        expect(screen.getAllByText('+').length).toBeGreaterThan(0)
        expect(screen.getAllByText('−').length).toBeGreaterThan(0)
        expect(screen.getAllByText('S').length).toBeGreaterThan(0)
    })

    it('chop etish tugmasi bosilganda window.print chaqiriladi', async () => {
        const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})

        renderWithProviders(
            <AttendancePrintModal
                students={mockStudents}
                pastColumns={mockPastColumns}
                groupName="Frontend-101"
                monthLabel="Joriy oy"
                onClose={vi.fn()}
            />
        )

        const printButton = screen.getByRole('button', { name: /chop etish/i })
        await userEvent.click(printButton)

        expect(printSpy).toHaveBeenCalledTimes(1)
        printSpy.mockRestore()
    })

    it('yopish tugmasi bosilganda onClose chaqiriladi', async () => {
        const onClose = vi.fn()
        renderWithProviders(
            <AttendancePrintModal
                students={mockStudents}
                pastColumns={mockPastColumns}
                groupName="Frontend-101"
                monthLabel="Joriy oy"
                onClose={onClose}
            />
        )

        const closeButton = screen.getByRole('button', { name: /yopish/i })
        await userEvent.click(closeButton)

        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("qoralama (draft) mavjud bo'lganda yangi dars ustunini ham ko'rsatadi", () => {
        const mockDraft: AttendanceDraft = {
            lesson: {
                id: 'lesson-3',
                title: '3',
                lessonDate: '2026-03-05',
            },
            statuses: {
                'student-1': 'PRESENT',
                'student-2': 'ABSENT',
            },
            reasons: {},
        }

        renderWithProviders(
            <AttendancePrintModal
                students={mockStudents}
                pastColumns={mockPastColumns}
                draft={mockDraft}
                groupName="Frontend-101"
                monthLabel="Joriy oy"
                onClose={vi.fn()}
            />
        )

        expect(screen.getByText(/2026-03-05/)).toBeInTheDocument()
    })
})
