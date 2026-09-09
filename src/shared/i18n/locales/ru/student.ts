import type { StudentKeys } from '../uz/student'

/** O'quvchi paneli. (ruscha) */
export const student: Record<StudentKeys, string> = {
    'student.role': 'Ученик',
    'student.attendance': 'Моя посещаемость',
    'student.attendanceHint': 'Посещённые и пропущенные занятия.',
    'student.group': 'Моя группа',
    'student.groupHint': 'Группа, преподаватель и расписание.',
    'student.notFound': 'Ваша карточка ученика не найдена',
    'student.notFoundHint': 'По вашему номеру телефона нет записи ученика. Обратитесь к администратору.',
    'student.noGroups': 'У вас пока нет группы.',
    'student.noGroupsHint': 'Администратор ещё не добавил вас в группу.',
    'student.attendanceSummary': 'В этом месяце посетил(а) {{attended}} из {{total}} занятий.',
    'student.noAttendance': 'За этот месяц записей о занятиях нет.',
    'student.balance': 'Мой баланс',
    'student.balanceHint':
        'Отрицательное число означает задолженность. Ноль — баланс чист. Положительное число — аванс.',
}
