import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchUserByPhone } from '../api/adminApi'

/** Shundan kam raqamli qiymat bo'yicha qidirish mantiqsiz. */
const MIN_DIGITS = 9

/** Har harfda so'rov yubormaslik uchun kutish vaqti. */
const DEBOUNCE_MS = 500

/**
 * Telefon bo'yicha mavjud odamni qidiradi.
 *
 * Nega kechiktirib: administrator raqamni terayotganda har bosilgan raqam
 * uchun so'rov yuborilsa, bitta raqam kiritishga o'ndan ortiq so'rov ketadi
 * va oxirgisidan boshqasi keraksiz.
 */
export function useUserByPhone(token: string, phone: string, enabled: boolean) {
    const [debounced, setDebounced] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(phone), DEBOUNCE_MS)
        return () => clearTimeout(timer)
    }, [phone])

    const digits = debounced.replace(/\D/g, '')
    const isSearchable = enabled && digits.length >= MIN_DIGITS

    const query = useQuery({
        queryKey: queryKeys.userByPhone(debounced),
        queryFn: () => fetchUserByPhone(token, debounced),
        enabled: isSearchable,
        // Topilmagani ham javob — qayta-qayta urinishning ma'nosi yo'q.
        retry: false,
        staleTime: 60_000,
    })

    return {
        found: isSearchable ? (query.data ?? null) : null,
        isSearching: isSearchable && query.isFetching,
    }
}
