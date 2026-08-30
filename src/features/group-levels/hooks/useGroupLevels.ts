import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { createGroupLevel, deleteGroupLevel, fetchGroupLevels, updateGroupLevel } from '../api/groupLevelsApi'

export function useGroupLevels(token: string) {
    return useQuery({
        queryKey: queryKeys.groupLevels(),
        queryFn: () => fetchGroupLevels(token),
        retry: false,
        staleTime: 30_000,
    })
}

export function useGroupLevelMutations(token: string) {
    const queryClient = useQueryClient()

    const invalidate = async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.groupLevels() })
    }

    const create = useMutation({
        mutationFn: (body: unknown) => createGroupLevel(token, body),
        onSuccess: invalidate,
    })

    const update = useMutation({
        mutationFn: (body: unknown) => updateGroupLevel(token, body),
        onSuccess: invalidate,
    })

    const remove = useMutation({
        mutationFn: (id: string) => deleteGroupLevel(token, id),
        onSuccess: invalidate,
    })

    return { create, update, remove }
}
