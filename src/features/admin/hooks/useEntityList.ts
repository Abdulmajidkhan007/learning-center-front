import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchEntityPage } from '../api/adminApi'
import { PAGE_SIZE } from '../config/entities'
import type { AdminRow, EntityConfig } from '../types'

export interface EntityListState {
    page: number
    search: string
    /** Faqat `groups` tabida ishlatiladi. */
    status?: string
}

/**
 * Jadval ma'lumoti.
 *
 * `placeholderData` — sahifa yoki qidiruv o'zgarganda jadval bo'shab
 * ketmasin: eski ma'lumot yangisi kelguncha turadi, ekran "sakramaydi".
 */
export function useEntityList(entity: EntityConfig, token: string, state: EntityListState) {
    const params = { page: state.page, size: PAGE_SIZE, search: state.search, status: state.status }

    const query = useQuery({
        queryKey: queryKeys.entityList(entity.key, params),
        queryFn: () => fetchEntityPage(entity.endpoint, token, params),
        placeholderData: (previous) => previous,
    })

    const rows: AdminRow[] = query.data?.content ?? []

    return {
        ...query,
        rows,
        totalPages: query.data?.totalPages ?? 1,
        totalElements: query.data?.totalElements ?? rows.length,
    }
}
