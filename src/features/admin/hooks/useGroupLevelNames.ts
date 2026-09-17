import { useQuery } from '@tanstack/react-query'
import { apiFetch, queryKeys } from '@/shared/api'
import type { GroupLevelNameDto } from '@/shared/types'

/**
 * Onboarding qadami uchun guruh darajalari ro'yxatini yuklaydi.
 *
 * Darajalar sonini aniqlash uchun alohida `/count` endpoint'i yo'q.
 * Shuning uchun `/group-level/names` chaqirilib, massiv uzunligi tekshiriladi.
 */
export function useGroupLevelNames(token: string) {
    return useQuery({
        queryKey: queryKeys.groupLevelNameOptions(),
        queryFn: () => apiFetch<GroupLevelNameDto[]>('/group-level/names', { token }),
    })
}
