import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchBranch } from '../api/settingsApi'

/** `branchId` `/auth/me` dan keladi, shuning uchun u kelguncha so'rov yubormaymiz. */
export function useBranch(token: string, branchId: string | undefined) {
    return useQuery({
        queryKey: queryKeys.branch(branchId ?? ''),
        queryFn: () => fetchBranch(token, branchId as string),
        enabled: Boolean(branchId),
        staleTime: 5 * 60_000,
    })
}
