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

function parseCategoryData(
    category: AnalyticsCategory,
    data: AnalyticsStatDto | null | undefined
): { total: number | null | undefined; thisMonth: number | null | undefined } {
    if (data === undefined) return { total: undefined, thisMonth: undefined }
    if (data === null) return { total: null, thisMonth: null }

    const record = data as Record<string, number | undefined>

    switch (category) {
        case 'student':
            return {
                total: record.studentCount ?? null,
                thisMonth: record.studentsAddedInMonth ?? null,
            }
        case 'teacher':
            return {
                total: record.teacherCount ?? null,
                thisMonth: record.teachersAddedInMonth ?? null,
            }
        case 'lead':
            return {
                total: record.leadCount ?? null,
                thisMonth: record.leadCountInAMonth ?? null,
            }
        case 'invoice':
            return {
                total: record.invoiceAmount ?? null,
                thisMonth: record.invoiceAmountInAMonth ?? null,
            }
        case 'enrollment':
            return {
                total: record.enrollmentCount ?? null,
                thisMonth: record.enrollmentCountInAMonth ?? null,
            }
        case 'branch':
            return {
                total: record.branchCount ?? null,
                thisMonth: null,
            }
    }
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
            const { total, thisMonth } = parseCategoryData(category, query?.data)

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
