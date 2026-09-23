import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import {
    createOrganization,
    createSuperAdmin,
    fetchOrganizations,
    type OrganizationPayload,
    type SuperAdminPayload,
} from '../api/developerApi'

export function useOrganizations(token: string, page: number, search: string) {
    /*
     * Bu yerda, aksincha, bo'sh `search` YUBORILMAYDI.
     *
     * Tashkilotlar so'rovi boshqacha yozilgan: `:search ilike o.name`.
     * Bo'sh satr yuborilsa u hech bir nom bilan mos kelmaydi va ro'yxat
     * bo'sh chiqadi. Null bo'lsa esa shart butunlay o'tkazib yuboriladi.
     * Ya'ni tarif va obunadagidan teskari — shuning uchun alohida izoh.
     */
    const params = { page, size: 10, ...(search ? { search } : {}) }

    const query = useQuery({
        queryKey: queryKeys.organizations(params),
        queryFn: () => fetchOrganizations(token, params),
        placeholderData: (previous) => previous,
    })

    return {
        organizations: query.data?.content ?? [],
        totalPages: query.data?.totalPages ?? 0,
        totalElements: query.data?.totalElements ?? 0,
        isLoading: query.isLoading,
        error: query.error,
    }
}

export function useOrganizationMutations(token: string) {
    const queryClient = useQueryClient()
    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['organization'] })

    const create = useMutation({
        mutationFn: (body: OrganizationPayload) => createOrganization(token, body),
        onSuccess: invalidate,
    })

    // Super-admin qo'shilsa tashkilotlar ro'yxati o'zgarmaydi, lekin
    // "super-admini bormi" degan belgi o'zgaradi — shuning uchun baribir
    // yangilaymiz.
    const addSuperAdmin = useMutation({
        mutationFn: ({ organizationId, body }: { organizationId: string; body: SuperAdminPayload }) =>
            createSuperAdmin(token, organizationId, body),
        onSuccess: invalidate,
    })

    return { create, addSuperAdmin }
}
