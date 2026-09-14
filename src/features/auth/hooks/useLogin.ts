import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { login, selectOrganization, toSession } from '../api/authApi'
import type { IdNameDto, LoginCredentials, Session } from '@/shared/types'

/**
 * Kirish — bir yoki ikki bosqichda.
 *
 * Bitta markazda o'qiydigan odamga birinchi javobning o'zida token keladi.
 * Bir nechta markazda o'qiydigan o'quvchiga esa tokensiz javob va markazlar
 * ro'yxati keladi; u bittasini tanlagach ikkinchi so'rov yuboriladi.
 *
 * Ikkinchi so'rov telefon va parolni QAYTA yuboradi, chunki birinchi
 * bosqichda token berilmagan — o'zimizni tanitadigan boshqa narsa yo'q.
 * Shu sabab ma'lumotlar tanlash oralig'ida xotirada saqlanadi va sessiya
 * ochilishi bilan tashlanadi.
 *
 * `retry: false` — noto'g'ri parolni qayta-qayta yuborishning ma'nosi yo'q
 * va bu backendda hisobni bloklashi mumkin.
 */
export function useLogin(onSuccess: (session: Session) => void) {
    const [pending, setPending] = useState<{
        credentials: LoginCredentials
        organizations: IdNameDto[]
    } | null>(null)

    const mutation = useMutation({
        retry: false,
        mutationFn: async (credentials: LoginCredentials) => {
            const response = await login(credentials)

            if (response?.requiresOrganizationSelection) {
                return { credentials, organizations: response.organizations ?? [] }
            }

            const session = toSession(response)
            if (!session) throw new Error('ROLE_MISSING')
            return session
        },
        onSuccess: (result) => {
            if ('organizations' in result) {
                setPending(result)
                return
            }
            onSuccess(result)
        },
    })

    const selection = useMutation({
        retry: false,
        mutationFn: async (organizationId: string) => {
            if (!pending) throw new Error('ROLE_MISSING')
            const session = toSession(await selectOrganization(organizationId, pending.credentials))
            if (!session) throw new Error('ROLE_MISSING')
            return session
        },
        onSuccess: (session) => {
            setPending(null)
            onSuccess(session)
        },
    })

    return {
        /** Birinchi bosqich: telefon va parol. */
        submitCredentials: mutation.mutate,
        /** Ikkinchi bosqich; faqat `organizations` bo'lganda ma'noli. */
        submitOrganization: selection.mutate,
        /** Bo'sh bo'lmasa — tashkilot tanlash bosqichi ko'rsatiladi. */
        organizations: pending?.organizations ?? null,
        isPending: mutation.isPending || selection.isPending,
        error: mutation.error ?? selection.error,
    }
}
