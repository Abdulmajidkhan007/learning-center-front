/**
 * O'zbekcha — HAQIQAT MANBAI.
 *
 * Kalitlar tipi shu fayldan chiqariladi, ya'ni `ru.ts` yoki `en.ts` da
 * biror kalit yetishmasa kompilyator xato beradi. Yangi matn qo'shganda
 * tartib: avval shu yerga, keyin qolgan ikkitasiga.
 *
 * O'rin egallovchilar `{{name}}` ko'rinishida.
 */
export const uz = {
    // --- umumiy ---
    'common.save': 'Saqlash',
    'common.saving': 'Saqlanmoqda…',
    'common.cancel': 'Bekor qilish',
    'common.close': 'Yopish',
    'common.edit': 'Tahrirlash',
    'common.delete': "O'chirish",
    'common.signOut': 'Chiqish',
    'common.loading': 'Yuklanmoqda…',
    'common.empty': '—',
    'common.prev': 'Oldingi',
    'common.next': 'Keyingi',
    'common.pageInfo': '{{page}} / {{total}}-sahifa · jami {{count}}',
    'common.somethingWrong': 'Nimadir xato ketdi. Qaytadan urinib ko’ring.',
    'common.notConnected': 'Ulanmagan',

    // --- navigatsiya ---
    'nav.home': 'Bosh sahifa',
    'nav.attendance': 'Davomat',
    'nav.settings': 'Sozlamalar',
    'nav.menu': 'Menyu',

    // --- kirish ---
    'auth.brand': "Cornerstone o'quv markazi",
    'auth.headline': 'Xush kelibsiz.',
    'auth.subtitle': "To'xtagan joyingizdan davom eting.",
    'auth.phone': 'Telefon raqami',
    'auth.password': 'Parol',
    'auth.keepSignedIn': 'Meni eslab qol',
    'auth.signIn': 'Kirish',
    'auth.signingIn': 'Kirilmoqda…',
    'auth.invalidCredentials': "Telefon raqami yoki parol noto'g'ri",
    'auth.roleMissing': "Kirildi, lekin tokendan rolni o'qib bo'lmadi.",
    'auth.stamp': 'Birinchi semestrdan beri',
    'auth.quote':
        "“Har bir kurs, har bir guruh, har bir kichik yutuq — yaxshi registrator daftar yuritganday yozib boriladi.”",

    // --- rollar va bo'limlar ---
    'entity.students.plural': "O'quvchilar",
    'entity.students.singular': "O'quvchi",
    'entity.teachers.plural': "O'qituvchilar",
    'entity.teachers.singular': "O'qituvchi",
    'entity.groups.plural': 'Guruhlar',
    'entity.groups.singular': 'Guruh',
    'entity.lessons.plural': 'Darslar',
    'entity.lessons.singular': 'Dars',

    // --- admin ---
    'admin.role': 'Administrator',
    'admin.records': 'Yozuvlar',
    'admin.search': '{{entity}} ichidan qidirish…',
    'admin.new': '+ Yangi {{entity}}',
    'admin.newRecord': 'Yangi yozuv',
    'admin.editRecord': 'Yozuvni tahrirlash',
    'admin.newTitle': 'Yangi {{entity}}',
    'admin.editTitle': '{{entity}}ni tahrirlash',
    'admin.actions': 'Amallar',
    'admin.notFound': '{{entity}} topilmadi.',
    'admin.loadFailed': '{{entity}}ni yuklab bo’lmadi: {{message}}',
    'admin.deleteFailed': "O'chirib bo'lmadi: {{message}}",
    'admin.deleteConfirm': "Bu {{entity}} o'chirilsinmi? Buni qaytarib bo'lmaydi.",
    'admin.noFields':
        "Maydonlarni aniqlash uchun yozuv yo'q — API orqali bittasini qo'shing, keyin forma o'zi to'ldiriladi.",
    'admin.addStudents': "O'quvchi qo'shish",
    'admin.assignTitle': '{{group}} guruhiga o’quvchi qo’shish',
    'admin.assignPending':
        "O'quvchi biriktirish hali ulanmagan — endpoint berilgach, bu yerda tanlash oynasi bo'ladi.",
    'admin.filterStatus': 'Status bo’yicha filtr',

    // --- forma maydonlari ---
    'field.fullName': 'To’liq ism',
    'field.phone': 'Telefon',
    'field.birthDate': 'Tug’ilgan sana',
    'field.parentPhone': 'Ota-ona telefoni',
    'field.groupName': 'Guruh nomi',
    'field.room': 'Xona',
    'field.teacher': "O'qituvchi",
    'field.days': 'Kunlar',
    'field.startTime': 'Boshlanish vaqti',
    'field.endTime': 'Tugash vaqti',
    'field.status': 'Status',
    'field.select': '— Tanlang —',

    // --- guruh statuslari ---
    'status.STARTING': 'Boshlanmoqda',
    'status.ONGOING': 'Davom etmoqda',
    'status.ENDED': 'Tugagan',

    // --- hafta kunlari ---
    'day.MONDAY': 'Dush',
    'day.TUESDAY': 'Sesh',
    'day.WEDNESDAY': 'Chor',
    'day.THURSDAY': 'Pay',
    'day.FRIDAY': 'Jum',
    'day.SATURDAY': 'Shan',
    'day.SUNDAY': 'Yak',

    // --- o'qituvchi paneli ---
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

    // --- KPI kartalar ---
    'kpi.active': 'Faol',
    'kpi.new': 'Yangi',
    'kpi.lost': 'Ketgan',
    'kpi.potentialFail': 'Xavf ostida',
    'kpi.absent': 'Kelmagan',
    'kpi.redList': "Qizil ro'yxat",
    'kpi.blackList': "Qora ro'yxat",

    // --- davomat ---
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

    // --- sozlamalar ---
    'settings.title': 'Sozlamalar',
    'settings.appearance': "Ko'rinish",
    'settings.appearanceHint': 'Til va rang rejimi shu qurilmada saqlanadi.',
    'settings.language': 'Til',
    'settings.theme': 'Rang rejimi',
    'settings.themeLight': 'Yorug’',
    'settings.themeDark': 'To’q',
    'settings.profile': 'Profil',
    'settings.profileHint': "O'z ma'lumotlaringiz.",
    'settings.password': 'Parol',
    'settings.passwordHint': 'Parolni o’zgartirish.',
    'settings.currentPassword': 'Joriy parol',
    'settings.newPassword': 'Yangi parol',
    'settings.repeatPassword': 'Yangi parolni takrorlang',
    'settings.passwordMismatch': 'Yangi parollar mos kelmadi.',
    'settings.centre': 'Markaz sozlamalari',
    'settings.centreHint': "Butun markaz uchun — faqat administrator ko'radi.",
    'settings.centreName': 'Markaz nomi',
    'settings.centreLogo': 'Logotip havolasi',
    'settings.workStart': 'Ish boshlanishi',
    'settings.workEnd': 'Ish tugashi',
    'settings.weekend': 'Dam olish kunlari',

    // --- backend hali tayyor emas ---
    'settings.profileSaved': 'Profil saqlandi.',
    'settings.passwordChanged': 'Parol o‘zgartirildi.',
    'settings.passwordEmpty': 'Hamma maydonni to‘ldiring.',
    'settings.passwordTooShort': 'Yangi parol kamida 8 belgidan iborat bo‘lsin.',
    'group.dayType.ODD': 'Toq kunlar',
    'group.dayType.EVEN': 'Juft kunlar',
    'field.dayType': 'Jadval turi',
    'teacher.level': 'Daraja',
    'teacher.month': '{{current}}-oy',
    'teacher.lessonsCount': 'O‘tilgan darslar',

    'student.role': 'O‘quvchi',
    'student.attendance': 'Mening davomatim',
    'student.attendanceHint': 'Qatnashgan va qoldirgan darslaringiz.',
    'student.group': 'Mening guruhim',
    'student.groupHint': 'Guruh, o‘qituvchi va dars jadvali.',
    'student.notFound': 'O‘quvchi kartangiz topilmadi',
    'student.notFoundHint': 'Telefon raqamingiz bo‘yicha o‘quvchi yozuvi yo‘q. Administratorga murojaat qiling.',

    'pending.title': 'Backend hali tayyor emas',
    'pending.body':
        "Bu blok uchun endpoint hali yo'q. Ko'rinish tayyor — endpoint qo'shilgach, ma'lumot shu yerda chiqadi.",
    'pending.short': 'Endpoint yo’q',
} as const

export type TranslationKey = keyof typeof uz
export type Translations = Record<TranslationKey, string>
