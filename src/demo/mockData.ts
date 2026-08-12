import type {
    AttendanceDto,
    FullGroupDto,
    GroupDto,
    LessonDto,
    StudentDto,
    TeacherDto,
} from '@/shared/types'

/**
 * Demo uchun o'ylab topilgan ma'lumot.
 *
 * FAQAT demo build'ida ishlatiladi (`src/demo/` production bundle'ga
 * tushmaydi) — hech qanday haqiqiy shaxs ma'lumoti yo'q.
 */

export const teachers: TeacherDto[] = [
    { id: 't1', userDto: { id: 'u1', fullName: 'Nodira Rasulova', phone: '+998 90 111 22 33', birthDate: '1990-04-12' } },
    { id: 't2', userDto: { id: 'u2', fullName: 'Jasur Ergashev', phone: '+998 90 222 33 44', birthDate: '1988-11-03' } },
    { id: 't3', userDto: { id: 'u3', fullName: 'Malika Yo‘ldosheva', phone: '+998 91 333 44 55', birthDate: '1993-07-21' } },
]

export const students: StudentDto[] = [
    { id: 's1', parentPhone: '+998 90 900 10 01', userDto: { fullName: 'Aziza Karimova', phone: '+998 93 100 10 01', birthDate: '2007-02-14' } },
    { id: 's2', parentPhone: '+998 90 900 10 02', userDto: { fullName: 'Bekzod Toshev', phone: '+998 93 100 10 02', birthDate: '2006-09-30' } },
    { id: 's3', parentPhone: '+998 90 900 10 03', userDto: { fullName: 'Dilnoza Yusupova', phone: '+998 93 100 10 03', birthDate: '2007-05-05' } },
    { id: 's4', parentPhone: '+998 90 900 10 04', userDto: { fullName: 'Eldor Nazarov', phone: '+998 93 100 10 04', birthDate: '2008-01-19' } },
    { id: 's5', parentPhone: '+998 90 900 10 05', userDto: { fullName: 'Farida Sobirova', phone: '+998 93 100 10 05', birthDate: '2007-12-02' } },
    { id: 's6', parentPhone: '+998 90 900 10 06', userDto: { fullName: 'G‘ayrat Umarov', phone: '+998 93 100 10 06', birthDate: '2006-06-24' } },
    { id: 's7', parentPhone: '+998 90 900 10 07', userDto: { fullName: 'Hilola Ahmedova', phone: '+998 93 100 10 07', birthDate: '2008-03-11' } },
    { id: 's8', parentPhone: '+998 90 900 10 08', userDto: { fullName: 'Islom Qodirov', phone: '+998 93 100 10 08', birthDate: '2007-08-08' } },
]

export const groups: GroupDto[] = [
    {
        id: 'g1',
        name: 'Beginners A',
        room: '12',
        status: 'ONGOING',
        teacher: teachers[0],
        timeTable: { days: ['MONDAY', 'WEDNESDAY', 'FRIDAY'], startTime: '09:00:00', endTime: '10:30:00' },
    },
    {
        id: 'g2',
        name: 'Intermediate B',
        room: '7',
        status: 'ONGOING',
        teacher: teachers[0],
        timeTable: { days: ['TUESDAY', 'THURSDAY'], startTime: '15:00:00', endTime: '16:30:00' },
    },
    {
        id: 'g3',
        name: 'IELTS Intensive',
        room: '3',
        status: 'STARTING',
        teacher: teachers[1],
        timeTable: { days: ['MONDAY', 'THURSDAY', 'SATURDAY'], startTime: '18:00:00', endTime: '20:00:00' },
    },
    {
        id: 'g4',
        name: 'Kids Club',
        room: '1',
        status: 'ENDED',
        teacher: teachers[2],
        timeTable: { days: ['SATURDAY'], startTime: '11:00:00', endTime: '12:00:00' },
    },
]

/** Qaysi guruhda kim o'qiydi. */
export const groupRoster: Record<string, string[]> = {
    g1: ['s1', 's2', 's3', 's4', 's5'],
    g2: ['s6', 's7', 's8'],
    g3: ['s1', 's6', 's8'],
    g4: ['s4', 's5'],
}

export const lessons: LessonDto[] = [
    { id: 'l1', lessonNumber: 12, lessonDate: '2026-08-03', lessonName: 'Present Perfect — review' },
    { id: 'l2', lessonNumber: 13, lessonDate: '2026-08-05', lessonName: 'Listening practice' },
    { id: 'l3', lessonNumber: 14, lessonDate: '2026-08-07', lessonName: 'Speaking: part 2' },
]

export const attendance: AttendanceDto[] = [
    {
        id: 'a1',
        lessonId: 'l1',
        createdAt: '2026-08-03T09:05:00Z',
        attendanceStudents: [
            { studentId: 's1', status: 'PRESENT' },
            { studentId: 's2', status: 'ABSENT' },
            { studentId: 's3', status: 'PRESENT' },
            { studentId: 's4', status: 'LATE' },
            { studentId: 's5', status: 'PRESENT' },
        ],
    },
    {
        id: 'a2',
        lessonId: 'l2',
        createdAt: '2026-08-05T09:03:00Z',
        attendanceStudents: [
            { studentId: 's1', status: 'PRESENT' },
            { studentId: 's2', status: 'PRESENT' },
            { studentId: 's3', status: 'EXCUSED' },
            { studentId: 's4', status: 'PRESENT' },
            { studentId: 's5', status: 'PRESENT' },
        ],
    },
]

export function fullGroup(groupId: string): FullGroupDto {
    const group = groups.find((item) => item.id === groupId) ?? groups[0]
    const ids = groupRoster[group.id] ?? []
    return { groupDto: group, studentDto: students.filter((student) => ids.includes(student.id)) }
}
