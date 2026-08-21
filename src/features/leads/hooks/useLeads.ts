import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchLeads } from '../api/leadApi'
import type { LeadStatus } from '@/shared/types'

export const PAGE_SIZE = 15

export interface LeadFilters {
    page: number
    search: string
    status: LeadStatus | ''
}

/** Lidlar ro'yxati — filtr va sahifalash bilan. */
export function useLeads(token: string, filters: LeadFilters) {
    const params = {
        page: filters.page,
        size: PAGE_SIZE,
        // Bo'sh qiymatlarni `apiFetch` o'zi tushirib qoldiradi.
        search: filters.search || undefined,
        status: filters.status || undefined,
    }

    const query = useQuery({
        queryKey: queryKeys.leads(params),
        queryFn: () => fetchLeads(token, params),
        // Sahifa almashganda jadval bo'shab ketmasin — eski ma'lumot
        // yangisi kelguncha turadi.
        placeholderData: keepPreviousData,
    })

    const data = query.data
    return {
        leads: data?.content ?? [],
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
        isLoading: query.isLoading,
        error: query.error,
    }
}
