/** Spring Data `Page<T>` javobi. */
export interface Page<T> {
    content?: T[]
    totalPages?: number
    totalElements?: number
}

/** Backendning `IdNameDto` record'i — tanlagichlar uchun qisqartirilgan yozuv. */
export interface IdNameDto {
    id: string
    name: string
}

export * from './auth'
