import type { BadgeTone } from './Badge'
import type { SubscriptionStatus } from '@/shared/types'

/**
 * `GRACE` ataylab sariq: muddat tugagan, lekin kirish hali ochiq — bu
 * "xato" ham, "hammasi joyida" ham emas, oraliq holat.
 *
 * Alohida faylda, chunki `shared/ui/*.tsx` faqat komponent eksport qilsin
 * (aks holda Fast Refresh buziladi).
 */
export const subscriptionStatusTones: Record<SubscriptionStatus, BadgeTone> = {
    ACTIVE: 'success',
    GRACE: 'amber',
    EXPIRED: 'danger',
    CANCELED: 'neutral',
}
