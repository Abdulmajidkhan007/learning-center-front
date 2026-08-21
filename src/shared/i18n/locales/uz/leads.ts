/**
 * Lidlar bo'limi.
 *
 * O'zbekcha — HAQIQAT MANBAI. Yangi kalit avval shu yerga qo'shiladi,
 * keyin `ru/` va `en/` dagi shu nomli faylga.
 */
export const leads = {
    'lead.title': 'Lidlar',
    'lead.eyebrow': 'Potentsial o‘quvchilar',
    'lead.fullName': 'F.I.Sh.',
    'lead.phone': 'Telefon',
    'lead.callAt': 'Qo‘ng‘iroq vaqti',
    'lead.source': 'Manba',
    'lead.source.INSTAGRAM': 'Instagram',
    'lead.source.FACEBOOK': 'Facebook',
    'lead.source.TELEGRAM': 'Telegram',
    'lead.preferredCourse': 'Qiziqqan kursi',
    'lead.new': '+ Yangi lid',
    'lead.newTitle': 'Yangi lid',
    'lead.changeStatus': 'Holatni o‘zgartirish',
    'lead.search': 'ism yoki telefon…',
    'lead.allStatuses': 'Barcha holatlar',
    'lead.empty': 'Lid topilmadi',
    'lead.loadFailed': 'Lidlarni yuklab bo‘lmadi: {{message}}',
    'lead.deleteConfirm': '{{name}} o‘chirilsinmi? Buni qaytarib bo‘lmaydi.',
    'lead.status.NEW': 'Yangi',
    'lead.status.CONFIRMED': 'Tasdiqlangan',
    'lead.status.REJECTED': 'Rad etilgan',
    'lead.status.CALL_LATER': 'Keyinroq qo‘ng‘iroq',
} as const

export type LeadsKeys = keyof typeof leads
