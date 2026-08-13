/**
 * Summani ko'rsatish uchun formatlash.
 *
 * `Intl` ishlatilyapti, lekin valyuta belgisi bilan emas: backend valyutani
 * aytmaydi (`amount` — oddiy `BigDecimal`), shuning uchun "so'm" deb yozib
 * qo'yish taxmin bo'lardi. Faqat razryadlarga ajratamiz.
 */
export function formatAmount(amount?: number | null): string {
    if (amount === undefined || amount === null || Number.isNaN(amount)) return '—'
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(amount)
}
