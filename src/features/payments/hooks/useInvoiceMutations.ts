import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteInvoice } from '../api/invoiceApi'

/**
 * Hisob o'chirish.
 *
 * Ilgari bu yerda yaratish, holat almashtirish va pul qaytarish ham bor edi.
 * Backend to'lov modelini almashtirgach ular yo'qoldi: hisob avtomatik
 * yaratiladi, holat to'lovlardan kelib chiqadi, pul qaytarish esa
 * tranzaksiya bo'lib yoziladi (`useTransactionMutations` ga qarang).
 */
export function useInvoiceMutations(token: string) {
    const queryClient = useQueryClient()

    const remove = useMutation({
        mutationFn: (id: string) => deleteInvoice(token, id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['invoice'] }),
    })

    return { remove }
}
