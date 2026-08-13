import { createContext } from 'react'
import type { TranslationKey } from './locales/uz'

export const LOCALES = ['uz', 'ru', 'en'] as const
export type Locale = (typeof LOCALES)[number]

/** Til tanlagichida ko'rinadigan nomlar — har biri o'z tilida yoziladi. */
export const LOCALE_LABELS: Record<Locale, string> = {
    uz: "O'zbekcha",
    ru: 'Русский',
    en: 'English',
}

export type TranslateVars = Record<string, string | number>

export interface LocaleContextValue {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: TranslationKey, vars?: TranslateVars) => string
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
