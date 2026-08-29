import { apiFetch } from '@/shared/api'
import type { GroupDto, GroupLevelNameDto, LeadCreateDto, LeadDto, LeadRejectDto, LeadStatus, LeadUpdateDto, Page } from '@/shared/types'

const ENDPOINT = '/leads'

export async function fetchGroupOptions(token: string) {
    const data = await apiFetch<Page<GroupDto>>('/group', { token, params: { page: 0, size: 200 } })
    return (data?.content ?? []).map((group) => ({ value: group.id, label: group.name || group.id }))
}

export async function fetchLeadCourseOptions(token: string) {
    const data = await apiFetch<GroupLevelNameDto[]>('/group-level/names', { token })
    return (data ?? []).map((level) => ({ value: level.id, label: level.name || level.id }))
}

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

export function updateLead(token: string, id: string, body: LeadUpdateDto) {
    return apiFetch<LeadDto>(`${ENDPOINT}/${id}`, { method: 'PUT', token, body })
}

/** Backend requires status in the query string, never in the PATCH body. */
export function enrollLead(token: string, id: string, groupId: string) {
    return apiFetch<LeadDto>(`${ENDPOINT}/${id}/enroll`, { method: 'POST', token, params: { groupId } })
}

export function rejectLead(token: string, id: string, body: LeadRejectDto) {
    return apiFetch<LeadDto>(`${ENDPOINT}/${id}/reject`, { method: 'POST', token, body })
}

export function callLaterLead(token: string, id: string, callAt: string) {
    return apiFetch<LeadDto>(`${ENDPOINT}/${id}/callLater`, { method: 'PATCH', token, params: { callAt } })
}

export function deleteLead(token: string, id: string) {
    return apiFetch<void>(`${ENDPOINT}/${id}`, { method: 'DELETE', token })
}
