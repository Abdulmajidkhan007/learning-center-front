import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { updateBranch } from '../api/settingsApi'
import type { BranchUpdatePayload } from '@/shared/types'

export function useUpdateBranch(token: string, branchId: string | undefined) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: BranchUpdatePayload) => {
            // Tugma `branchId` kelguncha o'chirilgan; bu himoya chorasi.
            if (!branchId) throw new Error('Branch id is not loaded yet')
            return updateBranch(token, branchId, payload)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.branch(branchId ?? '') }),
    })
}
