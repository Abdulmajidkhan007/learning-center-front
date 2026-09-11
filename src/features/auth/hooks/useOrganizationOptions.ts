import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchOrganizationOptions } from '../api/authApi'

/**
 * Kirish oynasidagi tashkilot tanlagichi uchun ro'yxat.
 *
 * `retry: false` — bu ekranda kutib turish yomon: ro'yxat kelmasa ham
 * kirish oynasi ochiq qolishi kerak, xato bir marta ko'rinsin.
 */
export function useOrganizationOptions() {
    const query = useQuery({
        queryKey: queryKeys.organizationOptions,
        queryFn: fetchOrganizationOptions,
        retry: false,
        staleTime: 5 * 60_000,
    })

    // Javob kutilgan shaklda kelmasa ham ekran oqarib qolmasin: kirish
    // oynasi — undan chiqib ketib bo'lmaydigan yagona ekran.
    const organizations = Array.isArray(query.data) ? query.data : []

    return {
        options: organizations.map((organization) => ({
            value: organization.id,
            label: organization.name,
        })),
        isLoading: query.isLoading,
        error: query.error,
    }
}
