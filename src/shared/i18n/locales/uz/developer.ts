/**
 * Dasturchi paneli: tariflar va obunalar.
 *
 * To'lov QO'LDA qabul qilinadi, obunani dasturchi faollashtiradi —
 * shuning uchun bu yerda "to'lash" emas, "tasdiqlash" tili ishlatiladi.
 */
export const developer = {
    'developer.title': 'Dasturchi paneli',
    'developer.eyebrow': 'Tizim',
    'developer.plansTab': 'Tariflar',
    'developer.subscriptionsTab': 'Obunalar',
    'plan.code': 'Kod',
    'plan.name': 'Nomi',
    'plan.description': 'Izoh',
    'plan.price': 'Narxi',
    'plan.currency': 'Valyuta',
    'plan.duration': 'Muddati',
    'plan.months': '{count} oy',
    'plan.limits': 'Cheklovlar',
    'plan.active': 'Holati',
    'plan.inactive': 'Faol emas',
    'plan.empty': 'Hali tarif qo‘shilmagan.',
    'plan.new': 'Yangi tarif',
    'plan.newTitle': 'Tarif qo‘shish',
    'plan.edit': 'Tarifni tahrirlash',
    'plan.sortOrder': 'Tartib raqami',
    'plan.codeHint': 'Masalan: START, STANDARD, PRO. Keyin o‘zgartirilmaydi.',
    'feature.MAX_STUDENTS': 'O‘quvchi',
    'feature.MAX_TEACHERS': 'O‘qituvchi',
    'feature.MAX_GROUPS': 'Guruh',
    'feature.MAX_BRANCHES': 'Filial',
    'feature.MAX_USERS': 'Foydalanuvchi',
    'subscription.organization': 'Tashkilot',
    'subscription.plan': 'Tarif',
    'subscription.status': 'Holat',
    'subscription.startsAt': 'Boshlandi',
    'subscription.expiresAt': 'Tugaydi',
    'subscription.paidAmount': 'To‘langan',
    'subscription.note': 'Izoh',
    'subscription.noteHint': 'O‘tkazma haqida: bank, sana, ma’lumotnoma raqami.',
    'subscription.empty': 'Hali obuna yo‘q.',
    'subscription.new': 'Obunani faollashtirish',
    'subscription.newTitle': 'Yangi obuna',
    'subscription.renewHint': 'Tashkilotda amaldagi obuna bo‘lsa, yangi muddat uning tugash sanasidan davom etadi.',
    'subscription.search': 'Tashkilot nomi bo‘yicha qidirish',
    'subscription.status.ACTIVE': 'Faol',
    'subscription.status.GRACE': 'Muhlat berilgan',
    'subscription.status.EXPIRED': 'Muddati tugagan',
    'subscription.status.CANCELED': 'Bekor qilingan',
} as const

export type DeveloperKeys = keyof typeof developer
