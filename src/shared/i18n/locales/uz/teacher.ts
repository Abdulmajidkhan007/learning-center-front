/**
 * O'qituvchi paneli va KPI kartalar.
 *
 * O'zbekcha — HAQIQAT MANBAI. Yangi kalit avval shu yerga qo'shiladi,
 * keyin `ru/` va `en/` dagi shu nomli faylga.
 */
export const teacher = {
    'teacher.role': "O'qituvchi",
    'teacher.startLesson': 'Darsni boshlash',
    'teacher.starting': 'Boshlanmoqda…',
    'teacher.newLesson': 'Yangi dars',
    'teacher.startLessonFor': '{{group}} uchun darsni boshlash',
    'teacher.lessonName': 'Dars nomi (ixtiyoriy)',
    'teacher.lessonNamePlaceholder': 'masalan: Present Simple — takrorlash',
    'teacher.inProgress': 'Davom etmoqda',
    'teacher.lessonStarted': '{{number}}-dars boshlandi',
    'teacher.markAttendance': 'Davomatni belgilash',
    'teacher.switchGroup': 'Guruhni almashtirish',
    'teacher.selectGroup': 'Guruhni tanlang',
    'teacher.roster': "Ro'yxat",
    'teacher.studentsCount': "O'quvchilar ({{count}})",
    'teacher.noStudents': "Bu guruhda hali o'quvchi yo'q.",
    'teacher.loadingGroup': 'Guruh yuklanmoqda…',
    'teacher.loadFailed': 'Guruh ma’lumotini yuklab bo’lmadi: {{message}}',
    'teacher.noGroups': "Sizda hali guruh yo'q.",
    'teacher.noGroupsHint': "Guruhga biriktirilganingizdan so'ng u shu yerda paydo bo'ladi.",
    'teacher.noGroupSelected': 'Guruh tanlanmagan.',
    'teacher.pickGroup': "Ro'yxatni ko'rish uchun yuqoridan guruh tanlang.",
    'teacher.oddDays': 'Toq kunlar',
    'teacher.evenDays': 'Juft kunlar',
    'teacher.allDays': 'Hammasi',
    'teacher.currentUnit': 'Joriy mavzu',
    'teacher.homeworkDone': 'Uy vazifasi bajarilgan',
    'teacher.homeworkMissing': 'Bajarilmagan',
    'teacher.groupProgress': 'Guruh progressi',
    'kpi.active': 'Faol',
    'kpi.new': 'Yangi',
    'kpi.lost': 'Ketgan',
    'kpi.potentialFail': 'Xavf ostida',
    'kpi.absent': 'Kelmagan',
    'kpi.redList': "Qizil ro'yxat",
    'kpi.blackList': "Qora ro'yxat",
    'teacher.level': 'Daraja',
    'teacher.month': '{{current}}-oy',
    'teacher.lessonsCount': 'O‘tilgan darslar',
} as const

export type TeacherKeys = keyof typeof teacher
