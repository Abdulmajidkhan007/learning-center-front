import { useTheme } from '@/app/providers/useTheme'
import { IconButton } from './IconButton'
import { MoonIcon, SunIcon } from './icons'

/** Light ↔ dark almashtirgich. Tanlov localStorage'da saqlanadi. */
export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <IconButton label={isDark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={toggleTheme}>
            {isDark ? <SunIcon /> : <MoonIcon />}
        </IconButton>
    )
}
