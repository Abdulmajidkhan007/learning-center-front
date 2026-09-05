import { apiFetch } from '@/shared/api'
import type { GroupLevelDto } from '@/shared/types'

export async function fetchGroupLevels(token: string): Promise<GroupLevelDto[]> {
    return (await apiFetch<GroupLevelDto[]>('/group-level', { token })) ?? []
}

export function createGroupLevel(token: string, body: unknown) {
    return apiFetch('/group-level', { method: 'POST', token, body })
}

/** Bitta darajaning maydonlarini (nomdan tashqari) tahrirlaydi. */
export function updateGroupLevel(token: string, id: string, body: unknown) {
    return apiFetch(`/group-level/${id}`, { method: 'PUT', token, body })
}

/**
 * Faqat darajalarning TARTIBINI o'zgartiradi — tanasi
 * `{ levels: [{ id, orderNumber }] }`. Ilgari shu funksiya `updateGroupLevel`
 * deb atalgan edi, lekin bitta yozuvni emas, tartibni yangilaydi.
 */
export function reorderGroupLevels(token: string, body: unknown) {
    return apiFetch('/group-level', { method: 'PUT', token, body })
}

export function deleteGroupLevel(token: string, id: string) {
    return apiFetch(`/group-level/${id}`, { method: 'DELETE', token })
}
