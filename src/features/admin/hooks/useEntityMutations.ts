import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { createEntity, deleteEntity, updateEntity } from '../api/adminApi'
import type { EntityConfig, EntityKey, ModalMode } from '../types'

interface SaveArgs {
    mode: ModalMode
    id: string | null
    body: unknown
}

/**
 * Yaratish / tahrirlash / o'chirish.
 *
 * Har uchalasi muvaffaqiyatdan keyin shu entity'ning BARCHA so'rovlarini
 * (ro'yxat + soni) bekor qiladi. Prefiks bo'yicha invalidatsiya qilinadi,
 * shuning uchun qaysi sahifa/qidiruv ochiqligi ahamiyatsiz.
 */
export function useEntityMutations(entity: EntityConfig, token: string) {
    const queryClient = useQueryClient()

    // Boshqa formalardagi tanlagichlar shu ro'yxatlardan oziqlanadi va
    // `staleTime` uzun — yangi guruh/o'qituvchi darrov ko'rinishi uchun
    // ularni ham bekor qilamiz.
    const DEPENDENT_OPTIONS: Partial<Record<EntityKey, readonly unknown[]>> = {
        groups: queryKeys.groupOptions(),
        teachers: queryKeys.teacherOptions(),
    }

    async function invalidate() {
        await queryClient.invalidateQueries({ queryKey: ['entity', entity.key] })
        const optionsKey = DEPENDENT_OPTIONS[entity.key]
        if (optionsKey) await queryClient.invalidateQueries({ queryKey: optionsKey })
    }

    const save = useMutation({
        mutationFn: ({ mode, id, body }: SaveArgs) =>
            mode === 'create'
                ? createEntity(entity.endpoint, token, body)
                : updateEntity(entity.endpoint, token, id!, body),
        onSuccess: invalidate,
    })

    const remove = useMutation({
        mutationFn: (id: string) => deleteEntity(entity.endpoint, token, id),
        onSuccess: invalidate,
    })

    return { save, remove }
}
