import { useQuery } from '@tanstack/react-query'
import { apiFetch, queryKeys } from '@/shared/api'
import type { OrganizationDto } from '@/shared/types'

export function useMyOrganization(token: string, organizationId?: string) {
    return useQuery({
        queryKey: queryKeys.organization(organizationId),
        queryFn: () => apiFetch<OrganizationDto>(`/organization/${organizationId}`, { token }),
        enabled: Boolean(token && organizationId),
        staleTime: 5 * 60_000,
    })
}
