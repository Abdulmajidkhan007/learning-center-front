/**
 * Sozlamalar sahifasi.
 *
 * O'zbekcha — HAQIQAT MANBAI. Yangi kalit avval shu yerga qo'shiladi,
 * keyin `ru/` va `en/` dagi shu nomli faylga.
 */
export const settings = {
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
    'settings.profileSaved': 'Profil saqlandi.',
    'settings.passwordChanged': 'Parol o‘zgartirildi.',
    'settings.passwordEmpty': 'Hamma maydonni to‘ldiring.',
    'settings.passwordTooShort': 'Yangi parol kamida 8 belgidan iborat bo‘lsin.',
} as const

export type SettingsKeys = keyof typeof settings
