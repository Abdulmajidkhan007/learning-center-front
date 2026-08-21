import { apiFetch } from '@/shared/api'
import type { LeadDto, LeadSource, LeadStatus, Page } from '@/shared/types'

const ENDPOINT = '/leads'

export interface LeadListParams {
    page: number
    size: number
    search?: string
    status?: LeadStatus | ''
    [param: string]: string | number | undefined
}

export function fetchLeads(token: string, params: LeadListParams) {
    return apiFetch<Page<LeadDto>>(ENDPOINT, { token, params })
}

export interface CreateLeadPayload {
    fullName: string
    phone: string
    /** `LocalDateTime` — "yyyy-MM-ddTHH:mm:ss". */
    callAt?: string
    source: LeadSource
    preferredCourse?: string
}

export function createLead(token: string, body: CreateLeadPayload) {
    return apiFetch<LeadDto>(ENDPOINT, { method: 'POST', token, body })
}

export function deleteLead(token: string, id: string) {
    return apiFetch(`${ENDPOINT}/${id}`, { method: 'DELETE', token })
}

/**
 * Holatni o'zgartirish.
 *
 * Diqqat: `status` TANADA emas, QUERY parametrida yuboriladi
 * (`PATCH /{id}/status?status=...`) — boshqa mutatsiyalardan farqli.
 * Tahrirlash (`PUT /{id}`) shu yerga qo'shilmagan: `LeadUpdateDto` maydoni
 * `fullName` emas `name`, `preferredCourse` esa boshqa turda — backend
 * nomuvofiqligi tasdiqlanmaguncha yozilmaydi (`docs/backend-notes.md`).
 */
export function updateLeadStatus(token: string, id: string, status: LeadStatus) {
    return apiFetch<LeadDto>(`${ENDPOINT}/${id}/status`, {
        method: 'PATCH',
        token,
        params: { status },
    })
}
