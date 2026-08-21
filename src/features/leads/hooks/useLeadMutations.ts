import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLead, deleteLead, updateLeadStatus, type CreateLeadPayload } from '../api/leadApi'
import type { LeadStatus } from '@/shared/types'

/**
 * Lid yaratish / holatini o'zgartirish / o'chirish.
 *
 * Uchalasi ham `['lead']` prefiksini bekor qiladi — qaysi sahifa yoki
 * filtr ochiqligi ahamiyatsiz, hammasi yangilanadi.
 */
export function useLeadMutations(token: string) {
    const queryClient = useQueryClient()

    function invalidate() {
        return queryClient.invalidateQueries({ queryKey: ['lead'] })
    }

    const create = useMutation({
        mutationFn: (payload: CreateLeadPayload) => createLead(token, payload),
        onSuccess: invalidate,
    })

    const changeStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
            updateLeadStatus(token, id, status),
        onSuccess: invalidate,
    })

    const remove = useMutation({
        mutationFn: (id: string) => deleteLead(token, id),
        onSuccess: invalidate,
    })

    return { create, changeStatus, remove }
}
