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
    'transaction.title': 'To‘lov harakatlari',
    'transaction.eyebrow': 'Tranzaksiyalar',
    'transaction.new': '+ To‘lov qo‘shish',
    'transaction.newTitle': 'Yangi to‘lov',
    'transaction.date': 'Sana',
    'transaction.type': 'Turi',
    'transaction.type.PAID': 'To‘ladi',
    'transaction.type.RETURNED': 'Qaytarib olindi',
    'transaction.type.MONTHLY_FEE': 'Oylik to‘lov',
    'transaction.empty': 'To‘lov topilmadi',
    'transaction.hint': 'To‘lov o‘quvchining eng so‘nggi hisobiga bog‘lanadi. Hisobi bo‘lmasa yozib bo‘lmaydi.',
    'transaction.deleteConfirm': '{{amount}} miqdoridagi to‘lov o‘chirilsinmi? Buni qaytarib bo‘lmaydi.',
} as const

export type PaymentsKeys = keyof typeof payments
