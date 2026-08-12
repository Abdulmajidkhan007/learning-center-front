import type { GroupDto, WeekDay } from '@/shared/types'

/** Dushanba = 1 … Yakshanba = 7. */
const DAY_INDEX: Record<WeekDay, number> = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7,
}

export type DayFilter = 'all' | 'odd' | 'even'

/**
 * O'quv markazlarida guruhlar odatda "toq kunlar" (Du/Cho/Ju) yoki "juft
 * kunlar" (Se/Pay/Sha) jadvaliga bo'linadi. O'qituvchida ikkala turdagi
 * guruh bo'lsa, bugungisini tez topish uchun filtr kerak.
 */
export function dayParity(day: WeekDay): 'odd' | 'even' {
    return DAY_INDEX[day] % 2 === 1 ? 'odd' : 'even'
}

/** Guruh jadvalida shu turdagi kun bormi. */
export function groupMatchesFilter(group: GroupDto, filter: DayFilter): boolean {
    if (filter === 'all') return true
    const days = group.timeTable?.days ?? []
    // Jadvali yo'q guruh hech qanday filtrga tushmasin — aks holda u
    // ikkala ro'yxatda ham paydo bo'lib chalkashtiradi.
    if (days.length === 0) return false
    return days.some((day) => dayParity(day) === filter)
}
