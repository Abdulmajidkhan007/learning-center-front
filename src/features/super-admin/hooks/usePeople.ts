import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchPeople, type PeopleKind } from '../api/superAdminApi'

export function usePeople(token: string, kind: PeopleKind, page: number, search: string) {
    const params = { page, size: 10, ...(search ? { search } : {}) }

    const query = useQuery({
        queryKey: queryKeys.people(kind, params),
        queryFn: () => fetchPeople(token, kind, params),
        // Bo'lim almashganda jadval bo'shab ketmasin.
        placeholderData: (previous) => previous,
    })

    return {
        rows: query.data?.content ?? [],
        totalPages: query.data?.totalPages ?? 0,
        totalElements: query.data?.totalElements ?? 0,
        isLoading: query.isLoading,
        error: query.error,
    }
}
