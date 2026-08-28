import type { AttendanceKeys } from '../uz/attendance'

/** Davomat ekrani. (ruscha) */
export const attendance: Record<AttendanceKeys, string> = {
    'attendance.title': 'Посещаемость',
    'attendance.backToDashboard': 'Назад в панель',
    'attendance.student': 'Ученик',
    'attendance.noStudents': 'В этой группе нет учеников',
    'attendance.noStudentsHint': 'Добавьте учеников в группу, чтобы отмечать посещаемость.',
    'attendance.pastLessons': 'Прошедших занятий: {{count}}',
    'attendance.finish': 'Завершить',
    'attendance.submitting': 'Отправка…',
    'attendance.lessonNumber': 'Занятие {{number}}',
    'attendance.forStudent': 'Посещаемость: {{name}}',
    'attendance.PRESENT': 'Был',
    'attendance.ABSENT': 'Не был',
    'attendance.EXCUSED': 'По уважительной',
    'attendance.addExcuse': 'Указать причину для {{name}}',
    'attendance.excuseReason': 'Причина',
    'attendance.excusePlaceholder': 'Например: болезнь, семейные обстоятельства',
    'attendance.excuseNotStored': 'Причина пока не сохраняется на сервере — нужно поле в backend.',
    'attendance.hint': 'Клик по квадрату переключает был/не был. Точка в углу — уважительная причина.',
}
