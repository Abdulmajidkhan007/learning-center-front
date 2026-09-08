import type { UserDto } from './user'

/**
 * O'quvchining to'lov holati bitta guruh bo'yicha (`Enrollment.status`).
 *
 * `PARTIAL` — qisman to'langan; ya'ni "to'lamagan" ham, "to'lagan" ham emas.
 */
export type EnrollmentPaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID'

export interface StudentDto {
    id: string
    userDto?: UserDto
    parentPhone?: string
    /**
     * Balans va to'lov holati faqat `GET /student/me?groupId=…` javobida
     * keladi va BITTA GURUHGA tegishli — boshqa endpointlarda bo'sh bo'ladi.
     * Manfiy son — qarz (`paidAmount - monthlyFee`).
     */
    balance?: number
    status?: EnrollmentPaymentStatus
}
