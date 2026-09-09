import { apiFetch } from '@/shared/api'
import type { Page, TransactionDto, TransactionType } from '@/shared/types'

const ENDPOINT = '/transaction'

export interface TransactionListParams {
    page: number
    size: number
    search?: string
    [param: string]: string | number | undefined
}

export function fetchTransactions(token: string, params: TransactionListParams) {
    return apiFetch<Page<TransactionDto>>(ENDPOINT, { token, params })
}

export interface CreateTransactionPayload {
    type: TransactionType
    amount: number
    studentId: string
}

/**
 * To'lov yozuvini yaratadi.
 *
 * Diqqat: hisob (`invoiceId`) YUBORILMAYDI — backend uni o'quvchining eng
 * so'nggi hisobiga o'zi bog'laydi. Ya'ni eski hisobga to'lov qo'shib
 * bo'lmaydi, va o'quvchida umuman hisob bo'lmasa so'rov 404 qaytaradi.
 */
export function createTransaction(token: string, body: CreateTransactionPayload) {
    return apiFetch<TransactionDto>(ENDPOINT, { method: 'POST', token, body })
}

export function deleteTransaction(token: string, id: string) {
    return apiFetch(`${ENDPOINT}/${id}`, { method: 'DELETE', token })
}
