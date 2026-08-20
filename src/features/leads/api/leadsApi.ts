import { apiFetch } from '@/shared/api'
import type { LeadCreateDto, LeadDto, LeadStatus, Page } from '@/shared/types'

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

export function createLead(token: string, body: LeadCreateDto) {
    return apiFetch<LeadDto>(ENDPOINT, { method: 'POST', token, body })
}

export function updateLead(token: string, id: string, body: LeadCreateDto) {
    return apiFetch<LeadDto>(`${ENDPOINT}/${id}`, { method: 'PUT', token, body })
}

/** Backend requires status in the query string, never in the PATCH body. */
export function updateLeadStatus(token: string, id: string, status: LeadStatus) {
    return apiFetch<LeadDto>(`${ENDPOINT}/${id}/status`, { method: 'PATCH', token, params: { status } })
}

export function deleteLead(token: string, id: string) {
    return apiFetch<void>(`${ENDPOINT}/${id}`, { method: 'DELETE', token })
}
