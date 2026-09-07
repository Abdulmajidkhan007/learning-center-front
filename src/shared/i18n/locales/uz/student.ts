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
    'student.noGroups': 'Sizda hali guruh yo‘q.',
    'student.noGroupsHint': 'Administrator sizni birorta guruhga biriktirmagan.',
    'student.attendanceSummary': 'Shu oyda {{total}} darsdan {{attended}} tasida qatnashdi.',
    'student.noAttendance': 'Bu oy uchun dars yozuvlari yo‘q.',
    'student.balance': 'Balansim',
    'student.balanceHint':
        'Manfiy son — qarzingiz borligini bildiradi. Nol — balans toza. Musbat son — sizda avans bor.',
    'student.paymentStatus.UNPAID': 'To‘lanmagan',
    'student.paymentStatus.PARTIAL': 'Qisman to‘langan',
    'student.paymentStatus.PAID': 'To‘langan',
} as const

export type StudentKeys = keyof typeof student
