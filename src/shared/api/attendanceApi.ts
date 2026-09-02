import { apiFetch } from './httpClient'
import type { MonthlyAttendanceDto } from '../types'

const ENDPOINT = '/attendance'

/**
 * Guruhning oylik davomati.
 *
 * `previousMonths`: 1 — joriy oy, 2 — o'tgan oy, 3 — ikki oy oldin.
 * Backend kamida 1 ni kutadi, 0 yoki manfiy qiymatda 400 qaytaradi.
 */
export async function fetchMonthlyAttendance(
    token: string,
    groupId: string,
    previousMonths: number
): Promise<MonthlyAttendanceDto[]> {
    const data = await apiFetch<MonthlyAttendanceDto[]>(`${ENDPOINT}/monthly/${groupId}`, {
        token,
        params: { previousMonths },
    })
    return data ?? []
}
