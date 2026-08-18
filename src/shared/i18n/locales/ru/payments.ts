import type { PaymentsKeys } from '../uz/payments'

/** To'lovlar bo'limi. (ruscha) */
export const payments: Record<PaymentsKeys, string> = {
    'invoice.title': 'Платежи',
    'invoice.eyebrow': 'Счета',
    'invoice.number': 'Номер счёта',
    'invoice.student': 'Ученик',
    'invoice.amount': 'Сумма',
    'invoice.issuedAt': 'Дата выставления',
    'invoice.new': '+ Новый счёт',
    'invoice.newTitle': 'Новый счёт',
    'invoice.createHint':
        'Счёт создаётся со статусом «ожидает». Когда деньги придут, отметите его как оплаченный.',
    'invoice.type': 'Тип',
    'invoice.refund': 'Возврат',
    'invoice.refundFor': 'Кому вернуть',
    'invoice.refundHint': 'Сумму считает сервер: стоимость проведённых занятий удерживается, остаток возвращается.',
    'invoice.refundConfirm': 'Вернуть деньги ученику {{name}}? Сумму считает сервер: стоимость проведённых занятий удерживается, остаток возвращается.',
    'invoice.refundDone': 'Возвращено: {{amount}} ({{number}}).',
    'invoice.markPaid': 'Оплачено',
    'invoice.search': 'номер, имя или телефон…',
    'invoice.from': 'С даты',
    'invoice.to': 'По дату',
    'invoice.clearDates': 'Сбросить даты',
    'invoice.allStatuses': 'Все статусы',
    'invoice.empty': 'Счета не найдены',
    'invoice.loadFailed': 'Не удалось загрузить платежи: {{message}}',
    'invoice.deleteConfirm': 'Удалить счёт {{number}}? Это необратимо.',
    'invoice.status.PAID': 'Оплачен',
    'invoice.status.PENDING': 'Ожидает',
    'invoice.status.OVERDUE': 'Просрочен',
}
