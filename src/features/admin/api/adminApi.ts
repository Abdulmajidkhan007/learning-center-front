import { apiFetch } from '@/shared/api'
import type { Page, TeacherDto } from '@/shared/types'
import type { AdminRow } from '../types'

export interface EntityListParams {
    page: number
    size: number
    search?: string
    status?: string
    /** `apiFetch` query qurishda umumiy shakl kutadi. */
    [param: string]: string | number | undefined
}

export function fetchEntityPage(endpoint: string, token: string, params: EntityListParams) {
    return apiFetch<Page<AdminRow>>(endpoint, { token, params })
}

/**
 * Ba'zi kontrollerlar sof son (`5`), ba'zilari obyekt (`{ count: 5 }`)
 * qaytaradi — ikkalasini ham qabul qilamiz.
 * (Backendda bir xillashtirilsa, shu funksiya bir qatorga qisqaradi.)
 */
export async function fetchEntityCount(endpoint: string, token: string): Promise<number | null> {
    const raw = await apiFetch<number | { count?: number }>(`${endpoint}/count`, { token })
    const value = typeof raw === 'object' && raw !== null ? raw.count : raw
    return value === undefined || value === null ? null : Number(value)
}

export function createEntity(endpoint: string, token: string, body: unknown) {
    return apiFetch(endpoint, { method: 'POST', token, body })
}

export function updateEntity(endpoint: string, token: string, id: string, body: unknown) {
    return apiFetch(`${endpoint}/${id}`, { method: 'PUT', token, body })
}

export function deleteEntity(endpoint: string, token: string, id: string) {
    return apiFetch(`${endpoint}/${id}`, { method: 'DELETE', token })
}

/** Guruh formasidagi "Teacher" ro'yxati uchun. */
export async function fetchTeacherOptions(token: string) {
    const data = await apiFetch<Page<TeacherDto>>('/teacher', { token, params: { page: 0, size: 200 } })
    return (data?.content ?? []).map((teacher) => ({
        value: teacher.id,
        label: teacher.userDto?.fullName || teacher.id,
    }))
}
