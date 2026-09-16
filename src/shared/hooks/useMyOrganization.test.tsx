import { describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useMyOrganization } from './useMyOrganization'

const fetchMock = vi.fn()
globalThis.fetch = fetchMock

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })
    return ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe('useMyOrganization', () => {
    it('organizationId mavjud bo‘lganda GET /organization/{id} so‘rovini yuboradi', async () => {
        fetchMock.mockResolvedValueOnce(
            new Response(JSON.stringify({ id: 'org-1', name: 'Alia Education Center' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            })
        )

        const { result } = renderHook(() => useMyOrganization('test-token', 'org-1'), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(fetchMock).toHaveBeenCalledWith(
            '/api/v1/organization/org-1',
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer test-token',
                }),
            })
        )
        expect(result.current.data?.name).toBe('Alia Education Center')
    })

    it('organizationId bo‘lmasa so‘rov yuborilmaydi', () => {
        const { result } = renderHook(() => useMyOrganization('test-token', undefined), {
            wrapper: createWrapper(),
        })

        expect(result.current.fetchStatus).toBe('idle')
        expect(result.current.data).toBeUndefined()
    })
})
