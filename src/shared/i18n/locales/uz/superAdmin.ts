/**
 * Super-admin: tashkilotlar va filiallar.
 *
 * O'zbekcha — HAQIQAT MANBAI. Yangi kalit avval shu yerga qo'shiladi,
 * keyin `ru/` va `en/` dagi shu nomli faylga.
 */
export const superAdmin = {
    'superAdmin.role': 'Super-admin',
    'superAdmin.eyebrow': 'Tizim',
    'superAdmin.section': 'Bo‘lim',
    'superAdmin.search': 'nom bo‘yicha qidirish…',
    'org.plural': 'Tashkilotlar',
    'org.new': '+ Yangi tashkilot',
    'org.newTitle': 'Yangi tashkilot',
    'org.editTitle': 'Tashkilotni tahrirlash',
    'org.name': 'Nomi',
    'org.phone': 'Telefon',
    'org.email': 'Email',
    'org.website': 'Veb-sayt',
    'org.noAdminYet': 'Tashkilot bilan birga super-admin yaratilmaydi — uni alohida qo‘shish kerak.',
    'org.empty': 'Tashkilot topilmadi',
    'branch.plural': 'Filiallar',
    'branch.new': '+ Yangi filial',
    'branch.newTitle': 'Yangi filial',
    'branch.editTitle': 'Filialni tahrirlash',
    'branch.name': 'Filial nomi',
    'branch.address': 'Manzil',
    'branch.chargeForMonth': 'Oylik to‘lov',
    'branch.organization': 'Tashkilot',
    'branch.organizationLocked': 'Filialni boshqa tashkilotga ko‘chirib bo‘lmaydi.',
    'branch.empty': 'Filial topilmadi',
    'branch.deleteConfirm': '{{name}} filiali o‘chirilsinmi? Buni qaytarib bo‘lmaydi.',
} as const

export type SuperAdminKeys = keyof typeof superAdmin
