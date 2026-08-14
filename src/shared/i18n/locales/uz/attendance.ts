/**
 * Davomat ekrani.
 *
 * O'zbekcha — HAQIQAT MANBAI. Yangi kalit avval shu yerga qo'shiladi,
 * keyin `ru/` va `en/` dagi shu nomli faylga.
 */
export const attendance = {
    'attendance.title': 'Davomat',
    'attendance.backToDashboard': 'Panelga qaytish',
    'attendance.student': "O'quvchi",
    'attendance.noStudents': "Bu guruhda o'quvchi yo'q",
    'attendance.noStudentsHint': "Davomatni boshlash uchun guruhga o'quvchi qo'shing.",
    'attendance.pastLessons': "{{count}} ta o'tgan dars",
    'attendance.finish': 'Davomatni yakunlash',
    'attendance.submitting': 'Yuborilmoqda…',
    'attendance.lessonNumber': '{{number}}-dars',
    'attendance.forStudent': '{{name}} uchun davomat',
    'attendance.PRESENT': 'Keldi',
    'attendance.ABSENT': 'Kelmadi',
    'attendance.LATE': 'Kechikdi',
    'attendance.EXCUSED': 'Sababli',
    'attendance.addExcuse': '{{name}} uchun sabab yozish',
    'attendance.excuseReason': 'Sabab',
    'attendance.excusePlaceholder': 'Masalan: kasal, oilaviy sabab',
    'attendance.excuseNotStored': 'Izoh hozircha serverda saqlanmaydi — backendga maydon qo‘shilishi kerak.',
    'attendance.hint': 'Kvadratni bossangiz keldi/kelmadi almashadi. Burchakdagi nuqta — sababli qilish.',
} as const

export type AttendanceKeys = keyof typeof attendance
