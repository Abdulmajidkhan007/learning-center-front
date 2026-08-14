/**
 * `apiFetch` yuboradigan `Accept-Language` qiymati.
 *
 * Nega modul darajasidagi o'zgaruvchi: `apiFetch` — oddiy funksiya, hook
 * emas, ya'ni React kontekstiga qarolmaydi. Tilni har chaqiruvga parametr
 * qilib uzatish esa yuzlab joyga tegishni talab qilardi. Shuning uchun
 * `LocaleProvider` tanlovni shu yerga yozib qo'yadi.
 *
 * Backend `Accept-Language` ni AYNAN solishtiradi (`language.equals("ru")`),
 * shuning uchun `ru-RU` kabi standart brauzer shakli emas, faqat `uz` /
 * `ru` / `en` yuboriladi.
 */

let requestLocale = 'uz'

export function setRequestLocale(locale: string) {
    requestLocale = locale
}

export function getRequestLocale(): string {
    return requestLocale
}
