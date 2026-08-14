/**
 * Kirish sahifasi.
 *
 * O'zbekcha — HAQIQAT MANBAI. Yangi kalit avval shu yerga qo'shiladi,
 * keyin `ru/` va `en/` dagi shu nomli faylga.
 */
export const auth = {
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
} as const

export type AuthKeys = keyof typeof auth
