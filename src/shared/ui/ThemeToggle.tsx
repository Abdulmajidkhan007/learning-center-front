import { IconButton } from './IconButton'
import { MoonIcon, SunIcon } from './icons'

interface ThemeToggleProps {
    theme?: string
    toggleTheme?: () => void
}

/** Light ↔ dark almashtirgich. Tanlov localStorage'da saqlanadi. */
export function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
    const isDark = theme === 'dark'

    return (
        <IconButton label={isDark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={toggleTheme}>
            {isDark ? <SunIcon /> : <MoonIcon />}
        </IconButton>
    )
}
