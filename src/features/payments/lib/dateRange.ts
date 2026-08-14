/**
 * `<input type="date">` beradigan "yyyy-MM-dd" ni backend kutayotgan
 * `LocalDateTime` ga aylantiradi.
 *
 * Nega kerak: `GET /invoice` da `from`/`to` — `LocalDateTime`. Sanani
 * shundoq yuborsak Spring uni ajrata olmaydi va 400 qaytaradi.
 *
 * Oxirgi kun ham qamrab olinishi uchun `to` kun oxiriga suriladi: aks holda
 * "1-avgustdan 5-avgustgacha" so'ralganda 5-avgust ertalabdan keyingi
 * hisoblar tushib qolardi.
 */
export function startOfDay(date: string): string | undefined {
    return date ? `${date}T00:00:00` : undefined
}

export function endOfDay(date: string): string | undefined {
    return date ? `${date}T23:59:59` : undefined
}
