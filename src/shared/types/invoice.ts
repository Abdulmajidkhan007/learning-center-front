import type { StudentDto } from './student'

export const INVOICE_STATUSES = ['PAID', 'PENDING', 'OVERDUE'] as const
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]

/**
 * `InvoiceDto` — to'lov hisobi.
 *
 * Diqqat: entity'da maydon `paymentStatus`, DTO'da esa `status`.
 * `amount` `BigDecimal` — JSON'da son bo'lib keladi, lekin tiyin/so'm
 * aniqligini yo'qotmaslik uchun biz uni HISOBLASHDA ishlatmaymiz, faqat
 * ko'rsatamiz.
 */
export interface InvoiceDto {
    id: string
    invoiceNumber?: string
    student?: StudentDto
    amount?: number
    /** `LocalDateTime` — "yyyy-MM-ddTHH:mm:ss". */
    issuedAt?: string
    status?: InvoiceStatus
    /**
     * To'lov turi: o'quvchi to'ladimi yoki markaz qaytardimi.
     *
     * Ataylab union EMAS, oddiy `string`: `InvoiceType` enum'i backendning
     * merge bo'lmagan branchida va qiymatlari bizga aytilmagan. Taxmin
     * qilsak, noto'g'ri qiymat kelganda ekran buziladi. Qiymatlar
     * ma'lum bo'lgach union qilinadi (`JwtClaims['role']` bilan bir sabab).
     */
    type?: string
}
