import type { LeadsKeys } from '../uz/leads'

/** Lidlar bo'limi. (ruscha) */
export const leads: Record<LeadsKeys, string> = {
    'lead.title': 'Лиды',
    'lead.eyebrow': 'Потенциальные ученики',
    'lead.fullName': 'Ф.И.О.',
    'lead.phone': 'Телефон',
    'lead.callAt': 'Время звонка',
    'lead.source': 'Источник',
    'lead.source.INSTAGRAM': 'Instagram',
    'lead.source.FACEBOOK': 'Facebook',
    'lead.source.TELEGRAM': 'Telegram',
    'lead.preferredCourse': 'Интересующий курс',
    'lead.new': '+ Новый лид',
    'lead.newTitle': 'Новый лид',
    'lead.changeStatus': 'Изменить статус',
    'lead.search': 'имя или телефон…',
    'lead.allStatuses': 'Все статусы',
    'lead.empty': 'Лиды не найдены',
    'lead.loadFailed': 'Не удалось загрузить лиды: {{message}}',
    'lead.deleteConfirm': 'Удалить {{name}}? Это необратимо.',
    'lead.status.NEW': 'Новый',
    'lead.status.CONFIRMED': 'Подтверждён',
    'lead.status.REJECTED': 'Отклонён',
    'lead.status.CALL_LATER': 'Перезвонить позже',
}
