import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import type { LeadCreateDto, LeadStatus } from '@/shared/types'
import { createLead, deleteLead, fetchLeads, updateLead, updateLeadStatus, type LeadListParams } from '../api/leadsApi'

export function useLeads(token: string, params: LeadListParams) {
    return useQuery({ queryKey: queryKeys.leads(params), queryFn: () => fetchLeads(token, params), placeholderData: (previous) => previous })
}

export function useLeadMutations(token: string) {
    const client = useQueryClient()
    const invalidate = () => void client.invalidateQueries({ queryKey: ['lead'] })
    return {
        create: useMutation({ mutationFn: (body: LeadCreateDto) => createLead(token, body), onSuccess: invalidate }),
        update: useMutation({ mutationFn: ({ id, body }: { id: string; body: LeadCreateDto }) => updateLead(token, id, body), onSuccess: invalidate }),
        status: useMutation({ mutationFn: ({ id, status }: { id: string; status: LeadStatus }) => updateLeadStatus(token, id, status), onSuccess: invalidate }),
        remove: useMutation({ mutationFn: (id: string) => deleteLead(token, id), onSuccess: invalidate }),
    }
}
