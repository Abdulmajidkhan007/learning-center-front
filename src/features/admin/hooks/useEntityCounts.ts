import { useQueries } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchEntityCount } from '../api/adminApi'
import { ENTITIES } from '../config/entities'
import type { EntityKey } from '../types'

/**
 * Yuqoridagi to'rtta statistika kartasi.
 *
 * `useQueries` — to'rt so'rov parallel ketadi va bittasi yiqilsa qolganlari
 * baribir ko'rsatiladi (`null` = "o'qib bo'lmadi", 0 dan farqli).
 */
export function useEntityCounts(token: string): Record<EntityKey, number | null | undefined> {
    const results = useQueries({
        queries: ENTITIES.map((entity) => ({
            queryKey: queryKeys.entityCount(entity.key),
            queryFn: () => fetchEntityCount(entity.endpoint, token),
            // Xato bo'lsa "—" ko'rsatiladi, butun sahifa yiqilmaydi.
            retry: false,
        })),
    })

    return Object.fromEntries(
        ENTITIES.map((entity, index) => [
            entity.key,
            results[index].isError ? null : results[index].data,
        ])
    ) as Record<EntityKey, number | null | undefined>
}
