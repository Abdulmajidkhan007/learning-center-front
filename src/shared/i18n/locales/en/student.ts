import type { StudentKeys } from '../uz/student'

/** O'quvchi paneli. (inglizcha) */
export const student: Record<StudentKeys, string> = {
    'student.role': 'Student',
    'student.attendance': 'My attendance',
    'student.attendanceHint': 'Lessons you attended and missed.',
    'student.group': 'My group',
    'student.groupHint': 'Group, teacher and timetable.',
    'student.notFound': 'No student record found',
    'student.notFoundHint': 'There is no student record for your phone number. Ask an administrator.',
    'student.noGroups': 'You have no groups yet.',
    'student.noGroupsHint': 'An administrator has not assigned you to a group.',
    'student.attendanceSummary': 'Attended {{attended}} out of {{total}} lessons this month.',
    'student.noAttendance': 'No lesson records for this month.',
    'student.balance': 'My balance',
    'student.balanceHint':
        'A negative number means you have a debt. Zero means your balance is clear. A positive number is a credit.',
}
