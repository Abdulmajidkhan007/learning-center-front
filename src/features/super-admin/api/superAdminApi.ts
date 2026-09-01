import { apiFetch } from '@/shared/api'
import type { AnalyticsCategory, AnalyticsStatDto, BranchDto, OrganizationDto, Page } from '@/shared/types'

const ORGANIZATIONS = '/organizations'
const BRANCHES = '/branch'
const ANALYTICS = '/analytics'

export interface ListParams {
    page: number
    size: number
    search?: string
    [param: string]: string | number | undefined
}

// --- tashkilotlar ---

export function fetchOrganizations(token: string, params: ListParams) {
    return apiFetch<Page<OrganizationDto>>(ORGANIZATIONS, { token, params })
}

export interface OrganizationPayload {
    name: string
    email?: string
    phone?: string
    website?: string
}

export function createOrganization(token: string, body: OrganizationPayload) {
    return apiFetch<OrganizationDto>(ORGANIZATIONS, { method: 'POST', token, body })
}

export function updateOrganization(token: string, id: string, body: OrganizationPayload) {
    return apiFetch<OrganizationDto>(`${ORGANIZATIONS}/${id}`, { method: 'PUT', token, body })
}

// Tashkilotni o'chirish ATAYLAB yo'q: backendda `OrganizationService.delete`
// bo'sh metod, lekin controller 204 qaytaradi. Tugma qo'ysak, foydalanuvchi
// "o'chdi" deb o'ylaydi va sahifa yangilanganda yozuv joyida turaveradi.
// `docs/backend-api-request.md` ga qarang.

// --- filiallar ---

export function fetchBranches(token: string, params: ListParams) {
    return apiFetch<Page<BranchDto>>(BRANCHES, { token, params })
}

export interface BranchPayload {
    name: string
    address?: string
    /** Faqat yaratishda: qaysi tashkilotga tegishli. */
    organizationId?: string
}

export function createBranch(token: string, body: BranchPayload) {
    return apiFetch<BranchDto>(BRANCHES, { method: 'POST', token, body })
}

export function updateBranch(token: string, id: string, body: Omit<BranchPayload, 'organizationId'>) {
    return apiFetch<BranchDto>(`${BRANCHES}/${id}`, { method: 'PUT', token, body })
}

export function deleteBranch(token: string, id: string) {
    return apiFetch(`${BRANCHES}/${id}`, { method: 'DELETE', token })
}

// --- analytics ---

export function fetchAnalytics(token: string, category: AnalyticsCategory) {
    return apiFetch<AnalyticsStatDto>(`${ANALYTICS}/${category}`, { token })
}
