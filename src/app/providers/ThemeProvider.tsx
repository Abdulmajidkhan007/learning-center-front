import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './theme-context'

const STORAGE_KEY = 'clc-theme'

/**
 * Boshlang'ich temani aniqlaydi: avval foydalanuvchi tanlovi, u bo'lmasa
 * tizim sozlamasi. `localStorage` try/catch ichida — private rejimda u
 * xato berishi mumkin va bu butun ilovani yiqitmasligi kerak.
 */
function resolveInitialTheme(): Theme {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'light' || stored === 'dark') return stored
    } catch {
        /* localStorage ishlamayapti — tizim sozlamasiga o'tamiz */
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(resolveInitialTheme)

    // Yagona haqiqat manbai — <html> dagi `dark` klassi; ranglar index.css da.
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        try {
            localStorage.setItem(STORAGE_KEY, theme)
        } catch {
            /* saqlab bo'lmadi — sessiya davomida baribir ishlaydi */
        }
    }, [theme])

    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
    }, [])

    const value = useMemo(() => ({ theme, toggleTheme, setTheme }), [theme, toggleTheme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
