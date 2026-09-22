import { apiFetch } from '@/shared/api'
import type {
    OrganizationDto,
    Page,
    PlanDto,
    PlanPayload,
    SubscriptionCreatePayload,
    SubscriptionDto,
    SubscriptionUpdatePayload,
    UserDto,
} from '@/shared/types'

/*
 * DIQQAT: backendda bu ikki kontroller hozircha `/api/plans` va
 * `/api/subscriptions` da turibdi — qolgan hammasi esa `/api/v1/…` da.
 * Bu yerda to'g'ri yo'l yozilgan; backend jamoasidan `v1` qo'shishni
 * so'radik, chunki `apiFetch` hamma so'rovga `/api/v1` ni qo'shadi va
 * ikkitagina yo'l uchun istisno qilish keyinchalik chalkashtiradi.
 */
const PLANS = '/plans'
const SUBSCRIPTIONS = '/subscriptions'

export interface ListParams {
    page: number
    size: number
    search?: string
    [param: string]: string | number | undefined
}

// --- tariflar ---

export function fetchPlans(token: string, params: ListParams) {
    return apiFetch<Page<PlanDto>>(PLANS, { token, params })
}

export function createPlan(token: string, body: PlanPayload) {
    return apiFetch<PlanDto>(PLANS, { method: 'POST', token, body })
}

export function updatePlan(token: string, id: string, body: PlanPayload) {
    return apiFetch<PlanDto>(`${PLANS}/${id}`, { method: 'PUT', token, body })
}

export function deletePlan(token: string, id: string) {
    return apiFetch<void>(`${PLANS}/${id}`, { method: 'DELETE', token })
}

// --- obunalar ---

export function fetchSubscriptions(token: string, params: ListParams) {
    return apiFetch<Page<SubscriptionDto>>(SUBSCRIPTIONS, { token, params })
}

/** Muddat mavjud obunaning oxiridan davom etadi — buni backend hisoblaydi. */
export function createSubscription(token: string, body: SubscriptionCreatePayload) {
    return apiFetch<SubscriptionDto>(SUBSCRIPTIONS, { method: 'POST', token, body })
}

/** Faqat holatni qo'lda to'g'rilash uchun; uzaytirish `createSubscription` orqali. */
export function updateSubscription(token: string, id: string, body: SubscriptionUpdatePayload) {
    return apiFetch<SubscriptionDto>(`${SUBSCRIPTIONS}/${id}`, { method: 'PUT', token, body })
}

/**
 * Obuna yaratishdagi tashkilot tanlagichi uchun.
 *
 * `super-admin` bo'limida shunga o'xshash chaqiruv bor, lekin bo'limlar
 * bir-biridan import QILMAYDI — shuning uchun ataylab takrorlangan.
 */
export async function fetchOrganizationOptions(token: string) {
    const data = await apiFetch<Page<OrganizationDto>>('/organization', {
        token,
        params: { page: 0, size: 200 },
    })
    return (data?.content ?? []).map((organization) => ({
        value: organization.id,
        label: organization.name || organization.id,
    }))
}

// --- tashkilotlar ---

const ORGANIZATIONS = '/organization'

/**
 * Barcha tashkilotlar. `GET /organization/{id}` dan foydalanilmaydi — u
 * chaqiruvchining O'Z tashkiloti bilan solishtiradi, ya'ni dasturchi
 * boshqasini ocha olmaydi. Ro'yxatning o'zi yetarli.
 */
export function fetchOrganizations(token: string, params: ListParams) {
    return apiFetch<Page<OrganizationDto>>(ORGANIZATIONS, { token, params })
}

export interface OrganizationPayload {
    name: string
    email?: string
    phone?: string
    website?: string
    daysBeforeDebt?: number
}

export function createOrganization(token: string, body: OrganizationPayload) {
    return apiFetch<OrganizationDto>(ORGANIZATIONS, { method: 'POST', token, body })
}

export interface SuperAdminPayload {
    fullName: string
    phone: string
    password: string
    branchId?: string
}

/**
 * Tashkilotga birinchi super-admin ochadi.
 *
 * Bu yerda parol QO'LDA beriladi (backend `AdminUserCreateDto` da shunday) —
 * boshqa joylarda parol generatsiya qilinadi. Shuning uchun uni ekranda
 * ko'rsatib, dasturchining o'zi tanlashiga qo'yamiz.
 */
export function createSuperAdmin(token: string, organizationId: string, body: SuperAdminPayload) {
    return apiFetch<UserDto>('/developer/create-super-admin', {
        method: 'POST',
        token,
        params: { organizationId },
        body,
    })
}
