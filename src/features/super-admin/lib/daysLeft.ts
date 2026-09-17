/**
 * Obuna tugashiga necha kun qolgani.
 *
 * Kun bo'yicha hisoblanadi, soat bo'yicha emas: foydalanuvchi "ertaga
 * tugaydi" deb o'ylaydi, "17 soatdan keyin" deb emas. Muddat o'tib
 * ketgan bo'lsa manfiy son qaytadi.
 */
export function daysLeft(expiresAt: string | undefined, now = new Date()): number | null {
    if (!expiresAt) return null
    const expiry = new Date(expiresAt)
    if (Number.isNaN(expiry.getTime())) return null

    const startOfDay = (date: Date) =>
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())

    return Math.round((startOfDay(expiry) - startOfDay(now)) / 86_400_000)
}
