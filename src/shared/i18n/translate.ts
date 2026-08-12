import { uz, type TranslationKey, type Translations } from './locales/uz'
import { ru } from './locales/ru'
import { en } from './locales/en'
import type { Locale, TranslateVars } from './locale-context'

export const DICTIONARIES: Record<Locale, Translations> = { uz, ru, en }

/**
 * Kalitni matnga aylantiradi va `{{name}}` o'rin egallovchilarini almashtiradi.
 *
 * Kalit topilmasa o'zbekchaga tushadi — bunday holat bo'lmasligi kerak
 * (tiplar buni ushlaydi), lekin ishlab chiqarishda ilova yiqilmasligi lozim.
 */
export function translate(locale: Locale, key: TranslationKey, vars?: TranslateVars): string {
    const template = DICTIONARIES[locale][key] ?? uz[key] ?? key
    if (!vars) return template
    return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => String(vars[name] ?? ''))
}
