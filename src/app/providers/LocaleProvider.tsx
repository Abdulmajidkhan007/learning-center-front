import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LocaleContext, LOCALES, type Locale } from '@/shared/i18n'
import { translate } from '@/shared/i18n'
import type { TranslationKey } from '@/shared/i18n'
import type { TranslateVars } from '@/shared/i18n/locale-context'

const STORAGE_KEY = 'clc-locale'
const DEFAULT_LOCALE: Locale = 'uz'

function isLocale(value: unknown): value is Locale {
    return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

/**
 * Boshlang'ich til: foydalanuvchi tanlovi, u bo'lmasa o'zbekcha.
 *
 * Brauzer tili ataylab hisobga olinmaydi — markaz O'zbekistonda, xodimlar
 * brauzeri esa ko'pincha inglizcha bo'ladi va bu noto'g'ri taxmin beradi.
 */
function resolveInitialLocale(): Locale {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (isLocale(stored)) return stored
    } catch {
        /* localStorage yopiq */
    }
    return DEFAULT_LOCALE
}

export function LocaleProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(resolveInitialLocale)

    // `<html lang>` — skrinriderlar va brauzerning imlo tekshiruvi uchun.
    useEffect(() => {
        document.documentElement.lang = locale
    }, [locale])

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next)
        try {
            localStorage.setItem(STORAGE_KEY, next)
        } catch {
            /* saqlanmadi — sessiya davomida baribir ishlaydi */
        }
    }, [])

    const value = useMemo(
        () => ({
            locale,
            setLocale,
            t: (key: TranslationKey, vars?: TranslateVars) => translate(locale, key, vars),
        }),
        [locale, setLocale]
    )

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
