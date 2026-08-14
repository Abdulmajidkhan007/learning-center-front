import { apiFetch } from '@/shared/api'
import type { InvoiceDto, InvoiceStatus, Page, StudentDto } from '@/shared/types'

const ENDPOINT = '/invoice'

export interface InvoiceListParams {
    page: number
    size: number
    search?: string
    status?: InvoiceStatus | ''
    /** `LocalDateTime` kutiladi — "yyyy-MM-ddTHH:mm:ss". */
    from?: string
    to?: string
    [param: string]: string | number | undefined
}

export function fetchInvoices(token: string, params: InvoiceListParams) {
    return apiFetch<Page<InvoiceDto>>(ENDPOINT, { token, params })
}

export interface CreateInvoicePayload {
    studentId: string
    amount: number
}

export function createInvoice(token: string, body: CreateInvoicePayload) {
    return apiFetch<InvoiceDto>(ENDPOINT, { method: 'POST', token, body })
}

/**
 * Hisob holatini o'zgartirish.
 *
 * `InvoiceUpdateDto` da faqat `status` bor — summa tahrirlanmaydi. To'lov
 * Payme/Click orqali emas, kartaga qo'lda o'tkaziladi, shuning uchun pulni
 * ko'rgan administrator hisobni shu yerda `PAID` qilib qo'yadi. Kim
 * tasdiqlagani backendda `updatedBy` ga o'zi yozilib qoladi.
 */
export function updateInvoiceStatus(token: string, id: string, status: InvoiceStatus) {
    return apiFetch<InvoiceDto>(`${ENDPOINT}/${id}`, { method: 'PUT', token, body: { status } })
}

export function deleteInvoice(token: string, id: string) {
    return apiFetch(`${ENDPOINT}/${id}`, { method: 'DELETE', token })
}

/**
 * Yangi hisob formasidagi o'quvchi tanlagichi.
 *
 * Bo'limlar bir-biridan import qilmagani uchun admin'dagi o'xshash
 * funksiyaga tayanmaymiz — bu yerda o'zimizniki turadi.
 */
export async function fetchStudentOptions(token: string) {
    const data = await apiFetch<Page<StudentDto>>('/student', { token, params: { page: 0, size: 200 } })
    return (data?.content ?? []).map((student) => ({
        value: student.id,
        label: student.userDto?.fullName || student.id,
    }))
}
