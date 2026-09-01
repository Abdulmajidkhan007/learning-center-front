import { useQueries } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchEntityCount } from '../api/adminApi'
import type { EntityConfig, EntityKey } from '../types'

/**
 * Yuqoridagi statistika kartalari.
 *
 * `entities` — chaqiruvchi ruxsatga qarab filtrlab beradi: ruxsat yo'q
 * bo'limga so'rov umuman yubormaymiz (backendda 403 bo'lardi).
 * `useQueries` — so'rovlar parallel ketadi va bittasi yiqilsa qolganlari
 * baribir ko'rsatiladi (`null` = "o'qib bo'lmadi", 0 dan farqli).
 */
export function useEntityCounts(
    token: string,
    entities: EntityConfig[]
): Partial<Record<EntityKey, number | null | undefined>> {
    const results = useQueries({
        queries: entities.map((entity) => ({
            queryKey: queryKeys.entityCount(entity.key),
            queryFn: () => fetchEntityCount(entity.endpoint, token),
            // Xato bo'lsa "—" ko'rsatiladi, butun sahifa yiqilmaydi.
            retry: false,
        })),
    })

    return Object.fromEntries(
        entities.map((entity, index) => [
            entity.key,
            results[index].isError ? null : results[index].data,
        ])
    ) as Partial<Record<EntityKey, number | null | undefined>>
}
