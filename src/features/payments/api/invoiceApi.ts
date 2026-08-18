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
 * Pul qaytarish.
 *
 * O'quvchi oylik to'lovni to'lab, oy o'rtasida ketsa (masalan sayohatga),
 * markaz qolgan pulni qaytaradi. **Summani backend o'zi hisoblaydi** —
 * o'tilgan darslar puli ushlab qolinadi, qolgani qaytariladi. Shuning uchun
 * bu yerda summa yuborilmaydi va oldindan ko'rsatilmaydi: mijozda hisoblasak,
 * server bilan farq chiqib, foydalanuvchiga noto'g'ri raqam aytardik.
 *
 * Hisob `studentId` bo'yicha, ya'ni bitta yozuvga emas, O'QUVCHIGA tegishli.
 */
export function returnInvoice(token: string, studentId: string) {
    return apiFetch<InvoiceDto>(`${ENDPOINT}/return`, {
        method: 'POST',
        token,
        params: { studentId },
    })
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
