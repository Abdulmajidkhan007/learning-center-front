/**
 * To'lovlar bo'limi.
 *
 * O'zbekcha — HAQIQAT MANBAI. Yangi kalit avval shu yerga qo'shiladi,
 * keyin `ru/` va `en/` dagi shu nomli faylga.
 */
export const payments = {
    'invoice.title': 'To‘lovlar',
    'invoice.eyebrow': 'Hisoblar',
    'invoice.number': 'Hisob raqami',
    'invoice.student': 'O‘quvchi',
    'invoice.amount': 'Summa',
    'invoice.issuedAt': 'Berilgan sana',
    'invoice.new': '+ Yangi hisob',
    'invoice.newTitle': 'Yangi hisob',
    'invoice.createHint':
        'Hisob “kutilmoqda” holatida yaratiladi. Pul kelgach uni “to‘landi” qilib belgilaysiz.',
    'invoice.markPaid': 'To‘landi',
    'invoice.search': 'raqam, ism yoki telefon…',
    'invoice.from': 'Sanadan',
    'invoice.to': 'Sanagacha',
    'invoice.clearDates': 'Sanani tozalash',
    'invoice.allStatuses': 'Barcha holatlar',
    'invoice.empty': 'Hisob topilmadi',
    'invoice.loadFailed': 'To‘lovlarni yuklab bo‘lmadi: {{message}}',
    'invoice.deleteConfirm': '{{number}} hisobi o‘chirilsinmi? Buni qaytarib bo‘lmaydi.',
    'invoice.status.PAID': 'To‘langan',
    'invoice.status.PENDING': 'Kutilmoqda',
    'invoice.status.OVERDUE': 'Muddati o‘tgan',
} as const

export type PaymentsKeys = keyof typeof payments
