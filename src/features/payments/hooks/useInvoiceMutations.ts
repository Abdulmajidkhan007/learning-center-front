import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createGroupInvoice, deleteInvoice } from '../api/invoiceApi'

/**
 * Hisob o'chirish va guruhga qo'lda hisob yaratish.
 *
 * Ilgari bu yerda yaratish, holat almashtirish va pul qaytarish ham bor edi.
 * Backend to'lov modelini almashtirgach ular yo'qoldi: hisob avtomatik
 * yaratiladi, holat to'lovlardan kelib chiqadi, pul qaytarish esa
 * tranzaksiya bo'lib yoziladi (`useTransactionMutations` ga qarang).
 */
export function useInvoiceMutations(token: string) {
    const queryClient = useQueryClient()

    async function invalidate() {
        await queryClient.invalidateQueries({ queryKey: ['invoice'] })
        // Hisob yaratilganda har bir o'quvchiga MONTHLY_FEE tranzaksiyasi
        // yoziladi va balansi o'zgaradi — ro'yxat eskirdi.
        await queryClient.invalidateQueries({ queryKey: ['transaction'] })
    }

    const remove = useMutation({
        mutationFn: (id: string) => deleteInvoice(token, id),
        onSuccess: invalidate,
    })

    const createForGroup = useMutation({
        mutationFn: (groupId: string) => createGroupInvoice(token, groupId),
        onSuccess: invalidate,
    })

    return { remove, createForGroup }
}
