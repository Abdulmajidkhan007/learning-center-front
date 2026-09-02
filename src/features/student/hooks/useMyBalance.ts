import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { fetchMyBalance } from '../api/studentApi'

/**
 * O'quvchining balansi.
 *
 * `GET /student/my/balance` hali backendda yo'q, shuning uchun bu hook
 * hozircha sahifada chaqirilmaydi — o'sha o'rinda `PendingBackend` turibdi.
 * Endpoint kelganda faqat shu hookni ulash kifoya.
 */
export function useMyBalance(token: string) {
    return useQuery({
        queryKey: queryKeys.myBalance(),
        queryFn: () => fetchMyBalance(token),
    })
}
