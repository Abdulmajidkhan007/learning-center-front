import type { UserDto } from './user'

export interface StudentDto {
    id: string
    userDto?: UserDto
    parentPhone?: string
    /**
     * Balans faqat `GET /student/me` javobida keladi — boshqa endpointlarda
     * bo'sh bo'ladi. U butun o'quvchiga tegishli, guruhga emas: to'lovlar
     * unga qo'shilib boradi, manfiy son qarzni bildiradi.
     */
    balance?: number
}
