import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    createInvoice,
    deleteInvoice,
    returnInvoice,
    updateInvoiceStatus,
    type CreateInvoicePayload,
} from '../api/invoiceApi'
import type { InvoiceStatus } from '@/shared/types'

/**
 * Hisob yaratish / holatini o'zgartirish / o'chirish.
 *
 * Uchalasi ham `['invoice']` prefiksini bekor qiladi — qaysi sahifa yoki
 * filtr ochiqligi ahamiyatsiz, hammasi yangilanadi.
 */
export function useInvoiceMutations(token: string) {
    const queryClient = useQueryClient()

    function invalidate() {
        return queryClient.invalidateQueries({ queryKey: ['invoice'] })
    }

    const create = useMutation({
        mutationFn: (payload: CreateInvoicePayload) => createInvoice(token, payload),
        onSuccess: invalidate,
    })

    const changeStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: InvoiceStatus }) =>
            updateInvoiceStatus(token, id, status),
        onSuccess: invalidate,
    })

    const remove = useMutation({
        mutationFn: (id: string) => deleteInvoice(token, id),
        onSuccess: invalidate,
    })

    const refund = useMutation({
        mutationFn: (studentId: string) => returnInvoice(token, studentId),
        onSuccess: invalidate,
    })

    return { create, changeStatus, remove, refund }
}
