import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { createSubscription, fetchSubscriptions, updateSubscription } from '../api/developerApi'
import type { SubscriptionCreatePayload, SubscriptionUpdatePayload } from '@/shared/types'

export function useSubscriptions(token: string, page: number, search: string) {
    // `search` doim yuboriladi, bo'sh bo'lsa ham — `usePlans.ts` dagi
    // izohga qarang: null yuborilsa backend so'rovi yiqiladi.
    const params = { page, size: 10, search }

    const query = useQuery({
        queryKey: queryKeys.subscriptions(params),
        queryFn: () => fetchSubscriptions(token, params),
        // Sahifa almashganda jadval bo'shab ketmasin — eski ma'lumot
        // yangisi kelguncha turadi.
        placeholderData: (previous) => previous,
    })

    return {
        subscriptions: query.data?.content ?? [],
        totalPages: query.data?.totalPages ?? 0,
        totalElements: query.data?.totalElements ?? 0,
        isLoading: query.isLoading,
        error: query.error,
    }
}

export function useSubscriptionMutations(token: string) {
    const queryClient = useQueryClient()
    // Obuna o'zgarsa tashkilotlar ro'yxati ham eskiradi: u yerda obuna
    // holati ko'rsatiladi.
    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['subscription'] })
        queryClient.invalidateQueries({ queryKey: ['organization'] })
    }

    const create = useMutation({
        mutationFn: (body: SubscriptionCreatePayload) => createSubscription(token, body),
        onSuccess: invalidate,
    })

    const changeStatus = useMutation({
        mutationFn: ({ id, body }: { id: string; body: SubscriptionUpdatePayload }) =>
            updateSubscription(token, id, body),
        onSuccess: invalidate,
    })

    return { create, changeStatus }
}
