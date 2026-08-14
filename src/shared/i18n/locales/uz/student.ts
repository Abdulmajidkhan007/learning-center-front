/**
 * O'quvchi paneli.
 *
 * O'zbekcha — HAQIQAT MANBAI. Yangi kalit avval shu yerga qo'shiladi,
 * keyin `ru/` va `en/` dagi shu nomli faylga.
 */
export const student = {
    'student.role': 'O‘quvchi',
    'student.attendance': 'Mening davomatim',
    'student.attendanceHint': 'Qatnashgan va qoldirgan darslaringiz.',
    'student.group': 'Mening guruhim',
    'student.groupHint': 'Guruh, o‘qituvchi va dars jadvali.',
    'student.notFound': 'O‘quvchi kartangiz topilmadi',
    'student.notFoundHint': 'Telefon raqamingiz bo‘yicha o‘quvchi yozuvi yo‘q. Administratorga murojaat qiling.',
} as const

export type StudentKeys = keyof typeof student
