import type { DayType, GroupNameDto } from '@/shared/types'

export type DayFilter = 'all' | DayType

/**
 * Guruhlarni jadval turi bo'yicha filtrlash.
 *
 * Backend guruhga `ODD` (Du/Cho/Ju) yoki `EVEN` (Se/Pay/Sha) turini
 * biriktiradi — bizda hisoblash kerak emas, tayyor qiymat keladi.
 *
 * MUHIM: `GET /group/groups` hozircha `GroupNameProjection` qaytaradi,
 * ya'ni faqat `id` va `name`. Proyeksiyaga `getDayType()` qo'shilsa,
 * filtr o'zi ishlab ketadi — shuning uchun `dayType` optional.
 */
export function groupMatchesFilter(group: GroupNameDto, filter: DayFilter): boolean {
    if (filter === 'all') return true
    return group.dayType === filter
}

/** Filtr foydali bo'lishi uchun kamida bitta guruhda `dayType` bo'lishi kerak. */
export function canFilterByDayType(groups: GroupNameDto[]): boolean {
    return groups.some((group) => group.dayType !== undefined)
}
