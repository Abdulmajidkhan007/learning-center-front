import { useQueries } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchAnalytics } from '../api/superAdminApi'
import type { AnalyticsCategory, AnalyticsStatDto } from '@/shared/types'

export const ANALYTICS_CATEGORIES: AnalyticsCategory[] = [
    'student',
    'teacher',
    'lead',
    'invoice',
    'enrollment',
    'branch',
]

export interface AnalyticsItemResult {
    category: AnalyticsCategory
    total: number | null | undefined
    thisMonth: number | null | undefined
    isLoading: boolean
    error: unknown
}

export function extractThisMonthValue(data: AnalyticsStatDto | null | undefined): number | null | undefined {
    if (!data) return undefined
    if (data.thisMonth !== undefined) return data.thisMonth
    if (data.addedThisMonth !== undefined) return data.addedThisMonth
    if (data.countThisMonth !== undefined) return data.countThisMonth
    if (data.thisMonthCount !== undefined) return data.thisMonthCount
    return null
}

export function useAnalytics(token: string) {
    const results = useQueries({
        queries: ANALYTICS_CATEGORIES.map((category) => ({
            queryKey: queryKeys.analytics(category),
            queryFn: () => fetchAnalytics(token, category),
            enabled: Boolean(token),
        })),
    })

    const items: Record<AnalyticsCategory, AnalyticsItemResult> = ANALYTICS_CATEGORIES.reduce(
        (acc, category, index) => {
            const query = results[index]
            const data = query?.data
            const total = data === null ? null : (data?.total ?? undefined)
            const thisMonth = data === null ? null : extractThisMonthValue(data)

            acc[category] = {
                category,
                total,
                thisMonth,
                isLoading: query?.isLoading ?? true,
                error: query?.error ?? null,
            }
            return acc
        },
        {} as Record<AnalyticsCategory, AnalyticsItemResult>
    )

    const isLoading = results.some((q) => q.isLoading)
    const error = results.find((q) => q.error)?.error ?? null

    return {
        items,
        isLoading,
        error,
    }
}
