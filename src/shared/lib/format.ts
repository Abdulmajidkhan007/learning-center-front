/**
 * Ko'rsatish uchun formatlash yordamchilari.
 *
 * Bular ilgari uchta sahifada nusxalanib yotardi — endi bitta joyda va
 * testlar bilan qoplangan.
 */

/** `LocalTime` "HH:mm:ss" dan soniyalarni olib tashlaydi. */
export function formatTime(value?: string | null): string {
    return value ? value.slice(0, 5) : ''
}

/** ISO datetime'dan faqat sanani ("yyyy-MM-dd") qoldiradi. */
export function formatDate(value?: string | null): string {
    return value ? value.slice(0, 10) : ''
}

/** Avatar uchun ism-familiyaning bosh harflari. */
export function initials(name?: string | null): string {
    if (!name) return '?'
    return name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

/** `parentPhone` → `Parent phone` — avtomatik jadval sarlavhalari uchun. */
export function formatHeader(key: string): string {
    return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase())
}

/** Ixtiyoriy qiymatni jadval katagiga tushadigan matnga aylantiradi. */
export function formatCell(value: unknown): string {
    if (value === null || value === undefined) return '—'
    if (typeof value === 'object') return JSON.stringify(value)
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
}

/** `PRESENT` → `Present`, `STARTING` → `Starting`. */
export function titleCase(value: string): string {
    return value.charAt(0) + value.slice(1).toLowerCase()
}

/** `Students` → `Student` — tugma va modal sarlavhalari uchun. */
export function singular(label: string): string {
    return label.endsWith('s') ? label.slice(0, -1) : label
}

/**
 * Summani ko'rsatish uchun formatlash.
 *
 * `Intl` ishlatilyapti, lekin valyuta belgisi bilan emas: backend valyutani
 * aytmaydi (`amount`/`monthlyFee` — oddiy son), shuning uchun "so'm" deb
 * yozib qo'yish taxmin bo'lardi. Faqat razryadlarga ajratamiz.
 */
export function formatAmount(amount?: number | null): string {
    if (amount === undefined || amount === null || Number.isNaN(amount)) return '—'
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(amount)
}
