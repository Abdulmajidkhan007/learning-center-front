import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { createPlan, deletePlan, fetchPlans, updatePlan } from '../api/developerApi'
import type { PlanPayload } from '@/shared/types'

const PAGE = { page: 0, size: 50 }

export function usePlans(token: string) {
    const query = useQuery({
        queryKey: queryKeys.plans(PAGE),
        queryFn: () => fetchPlans(token, PAGE),
        staleTime: 60_000,
    })

    return {
        // Tariflar ro'yxati qisqa — narx tartibida ko'rsatiladi, chunki
        // dasturchi ularni "arzondan qimmatga" deb o'ylaydi.
        plans: [...(query.data?.content ?? [])].sort((a, b) => a.price - b.price),
        isLoading: query.isLoading,
        error: query.error,
    }
}

export function usePlanMutations(token: string) {
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['plan'] })

    const save = useMutation({
        mutationFn: ({ id, body }: { id?: string; body: PlanPayload }) =>
            id ? updatePlan(token, id, body) : createPlan(token, body),
        onSuccess: invalidate,
    })

    const remove = useMutation({
        mutationFn: (id: string) => deletePlan(token, id),
        onSuccess: invalidate,
    })

    return { save, remove }
}
