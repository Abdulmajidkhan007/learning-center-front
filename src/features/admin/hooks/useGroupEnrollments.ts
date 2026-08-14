import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { createEnrollment, deleteEnrollment, fetchGroupEnrollments } from '../api/enrollmentApi'

export function useGroupEnrollments(token: string, groupId: string) {
    return useQuery({
        queryKey: queryKeys.groupEnrollments(groupId),
        queryFn: () => fetchGroupEnrollments(token, groupId),
        enabled: groupId !== '',
    })
}

export function useAddEnrollment(token: string, groupId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (studentId: string) => createEnrollment(token, { studentId, groupId }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.groupEnrollments(groupId) }),
    })
}

/** Guruhdan chiqarish — sabab majburiy (backend `@RequestParam` si shunday). */
export function useRemoveEnrollment(token: string, groupId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) =>
            deleteEnrollment(token, id, reason),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.groupEnrollments(groupId) }),
    })
}
