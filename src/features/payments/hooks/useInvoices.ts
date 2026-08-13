import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchInvoices } from '../api/invoiceApi'
import type { InvoiceStatus } from '@/shared/types'

export const PAGE_SIZE = 15

export interface InvoiceFilters {
    page: number
    search: string
    status: InvoiceStatus | ''
}

/** To'lovlar ro'yxati — filtr va sahifalash bilan. */
export function useInvoices(token: string, filters: InvoiceFilters) {
    const params = {
        page: filters.page,
        size: PAGE_SIZE,
        // Bo'sh qiymatlarni `apiFetch` o'zi tushirib qoldiradi.
        search: filters.search || undefined,
        status: filters.status || undefined,
    }

    const query = useQuery({
        queryKey: queryKeys.invoices(params),
        queryFn: () => fetchInvoices(token, params),
        // Sahifa almashganda jadval bo'shab ketmasin — eski ma'lumot
        // yangisi kelguncha turadi.
        placeholderData: keepPreviousData,
    })

    const data = query.data
    return {
        invoices: data?.content ?? [],
        totalPages: data?.totalPages ?? 0,
        totalElements: data?.totalElements ?? 0,
        isLoading: query.isLoading,
        error: query.error,
    }
}
