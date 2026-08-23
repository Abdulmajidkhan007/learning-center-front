import type { AttendanceKeys } from '../uz/attendance'

/** Davomat ekrani. (inglizcha) */
export const attendance: Record<AttendanceKeys, string> = {
    'attendance.title': 'Attendance',
    'attendance.backToDashboard': 'Back to dashboard',
    'attendance.student': 'Student',
    'attendance.noStudents': 'No students in this group',
    'attendance.noStudentsHint': 'Add students to the group to start taking attendance.',
    'attendance.pastLessons': '{{count}} past lessons',
    'attendance.finish': 'Finish attendance',
    'attendance.submitting': 'Submitting…',
    'attendance.lessonNumber': 'Lesson {{number}}',
    'attendance.forStudent': 'Attendance for {{name}}',
    'attendance.PRESENT': 'Present',
    'attendance.ABSENT': 'Absent',
    'attendance.EXCUSED': 'Excused',
    'attendance.addExcuse': 'Add a reason for {{name}}',
    'attendance.excuseReason': 'Reason',
    'attendance.excusePlaceholder': 'e.g. illness, family reasons',
    'attendance.excuseNotStored': 'The reason is not stored on the server yet — the backend needs a field.',
    'attendance.hint': 'Click a square to toggle present/absent. The corner dot marks it excused.',
}
