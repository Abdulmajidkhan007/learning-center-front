/**
 * Access token eskirganda uni yangilash.
 *
 * Nega modul darajasida: `apiFetch` — oddiy funksiya, hook emas, ya'ni
 * `AuthProvider` kontekstiga qarolmaydi (`requestLocale.ts` dagi kabi).
 * Shuning uchun provider o'z yangilash funksiyasini shu yerga yozib qo'yadi.
 *
 * Backend access tokenni 15 daqiqada eskirtiradi va eskirgan token bilan
 * kelgan so'rovga 403 qaytaradi (401 emas: `SecurityConfig` da
 * `authenticationEntryPoint` berilmagani uchun Spring `Http403ForbiddenEntryPoint`
 * ni ishlatadi). Busiz foydalanuvchi 15 daqiqadan keyin sahifani qo'lda
 * yangilamaguncha hech narsa ko'rmasdi.
 */

type TokenRefresher = () => Promise<string | null>

let refresher: TokenRefresher | null = null
let inFlight: Promise<string | null> | null = null

export function setTokenRefresher(next: TokenRefresher | null) {
    refresher = next
    inFlight = null
}

/**
 * Yangi access token oladi.
 *
 * Bir vaqtda kelgan chaqiruvlar bitta so'rovni bo'lishadi — admin paneli
 * ochilishida sakkizta so'rov barobar 403 bo'ladi, ularning har biri
 * alohida yangilashga urinsa backendga sakkizta ortiqcha so'rov ketardi.
 */
export function refreshAccessToken(): Promise<string | null> {
    if (!refresher) return Promise.resolve(null)
    if (!inFlight) {
        const current = refresher()
        inFlight = current
        void current.finally(() => {
            if (inFlight === current) inFlight = null
        })
    }
    return inFlight
}
