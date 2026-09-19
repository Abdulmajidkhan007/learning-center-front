/**
 * Telefonni backend kutgan ko'rinishga keltiradi: faqat `+` va raqamlar.
 * Foydalanuvchi `+998 90 123-45-67` deb yozadi — ilgari bunday yozuv
 * validatsiyadan o'tmay, "Saqlash" tugmasi jimgina o'chib qolar edi.
 */
export function normalizePhone(raw: string): string {
    const digits = raw.replace(/[^\d]/g, '')
    return raw.trim().startsWith('+') ? `+${digits}` : digits
}

/** E.164: ixtiyoriy `+`, birinchi raqam 0 emas, jami 2..15 raqam. */
const PHONE_RE = /^\+?[1-9]\d{1,14}$/

export function isValidPhone(raw: string): boolean {
    return PHONE_RE.test(normalizePhone(raw))
}

/** O'zbekiston raqamining bo'laklari: +998 90 123 45 67. */
const UZ_GROUPS = [2, 3, 2, 2]

/**
 * Yozish paytida o'qishga qulay ko'rinish beradi.
 *
 * Faqat O'zbekiston raqamiga (`998`) tegadi: qolganlarida har davlatning
 * o'z guruhlashi bor va biz uni bilmaymiz, shuning uchun tegmaymiz —
 * xato formatlash umuman formatlamaslikdan yomonroq.
 *
 * Bu FAQAT ko'rinish uchun. Serverga yuborishdan oldin `normalizePhone`
 * chaqiriladi, aks holda "+998 90 …" va "+99890…" ikki xil satr bo'lib,
 * telefon bo'yicha qidiruv ham, yagonalik sharti ham buziladi.
 */
export function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '')
    if (!digits.startsWith('998')) return raw

    const rest = digits.slice(3, 12)
    const parts: string[] = []
    let offset = 0
    for (const size of UZ_GROUPS) {
        if (offset >= rest.length) break
        parts.push(rest.slice(offset, offset + size))
        offset += size
    }

    return `+998${parts.length ? ' ' + parts.join(' ') : ' '}`
}

/** Yangi raqam yozishni boshlashdagi qiymat — har safar `+998` terilmasin. */
export const UZ_PHONE_PREFIX = '+998 '
