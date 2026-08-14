import { apiFetch } from '@/shared/api'
import type { Page } from '@/shared/types'

/**
 * O'quvchi ↔ guruh bog'lanishi.
 *
 * Backendda guruh ichida o'quvchilar ro'yxati saqlanmaydi — o'rtada
 * `enrollment` degan ko'prik yozuv turadi. Yangi enrollment yaratish =
 * guruhga o'quvchi qo'shish; o'chirilgan (soft-delete) enrollment esa
 * "ilgari shu yerda o'qigan" degani.
 */
export interface EnrollmentDto {
    /** Guruhdan chiqarish shu id bo'yicha ketadi. */
    id?: string
    studentId?: string
    groupId?: string
    reason?: string
}

const ENDPOINT = '/enrollments'

/** Guruhdagi faol yozuvlar (backend o'chirilganlarini bermaydi). */
export async function fetchGroupEnrollments(token: string, groupId: string) {
    const data = await apiFetch<Page<EnrollmentDto>>(ENDPOINT, {
        token,
        params: { groupId, page: 0, size: 200 },
    })
    return data?.content ?? []
}

export function createEnrollment(token: string, body: { studentId: string; groupId: string; reason?: string }) {
    return apiFetch<EnrollmentDto>(ENDPOINT, { method: 'POST', token, body })
}

/**
 * Guruhdan chiqarish.
 *
 * `reason` — backendda MAJBURIY `@RequestParam`, shuning uchun interfeysda
 * ham uni so'ramasdan chiqarib bo'lmaydi. Yozuv butunlay o'chmaydi
 * (soft-delete), ya'ni "ilgari shu guruhda o'qigan" ma'lumoti saqlanadi.
 */
export function deleteEnrollment(token: string, id: string, reason: string) {
    return apiFetch(`${ENDPOINT}/${id}`, { method: 'DELETE', token, params: { reason } })
}
