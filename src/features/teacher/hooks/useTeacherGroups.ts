import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchTeacherGroups } from '../api/teacherApi'

export function useTeacherGroups(token: string) {
    return useQuery({
        queryKey: queryKeys.teacherGroups(),
        queryFn: () => fetchTeacherGroups(token),
    })
}
