import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import {
    createTransaction,
    deleteTransaction,
    fetchTransactions,
    type CreateTransactionPayload,
} from '../api/transactionApi'

export const TRANSACTION_PAGE_SIZE = 10

/** To'lov harakatlari ro'yxati. */
export function useTransactions(token: string, page: number, search: string) {
    const params = { page, size: TRANSACTION_PAGE_SIZE, search: search || undefined }

    const query = useQuery({
        queryKey: queryKeys.transactions(params),
        queryFn: () => fetchTransactions(token, params),
        placeholderData: keepPreviousData,
    })

    const data = query.data
    return {
        transactions: data?.content ?? [],
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
        isLoading: query.isLoading,
        error: query.error,
    }
}

/**
 * To'lov qo'shish va o'chirish.
 *
 * Ikkala prefiks ham bekor qilinadi: to'lov o'quvchining balansini
 * o'zgartiradi va hisobning holatiga ta'sir qiladi, ya'ni hisoblar
 * ro'yxati ham eskiradi.
 */
export function useTransactionMutations(token: string) {
    const queryClient = useQueryClient()

    async function invalidate() {
        await queryClient.invalidateQueries({ queryKey: ['transaction'] })
        await queryClient.invalidateQueries({ queryKey: ['invoice'] })
    }

    const create = useMutation({
        mutationFn: (payload: CreateTransactionPayload) => createTransaction(token, payload),
        onSuccess: invalidate,
    })

    const remove = useMutation({
        mutationFn: (id: string) => deleteTransaction(token, id),
        onSuccess: invalidate,
    })

    return { create, remove }
}
