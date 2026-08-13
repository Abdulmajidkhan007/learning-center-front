import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { createEnrollment, fetchGroupEnrollments } from '../api/enrollmentApi'

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
