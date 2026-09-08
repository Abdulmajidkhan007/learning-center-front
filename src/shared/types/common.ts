/** Spring Data `Page<T>` javobi. */
export interface Page<T> {
    content?: T[]
    totalPages?: number
    totalElements?: number
}

export * from './auth'
