import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchGroupInfo } from '../api/teacherApi'

/** `groupId` bo'sh bo'lsa so'rov yuborilmaydi (guruhlar hali yuklanmagan). */
export function useGroupInfo(token: string, groupId: string) {
    return useQuery({
        queryKey: queryKeys.groupInfo(groupId),
        queryFn: () => fetchGroupInfo(token, groupId),
        enabled: groupId !== '',
    })
}
