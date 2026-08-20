import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { Brand } from './Brand'
import { IconButton } from './IconButton'
import { ThemeToggle } from './ThemeToggle'
import { SettingsIcon, SignOutIcon } from './icons'

interface AppShellProps {
    subtitle: string
    onSignOut: () => void
    /** Sahifaga xos tugmalar — mobil ekranda alohida qatorga tushadi. */
    actions?: ReactNode
    /** Sarlavha ostidagi qo'shimcha qator (guruh almashtirgich va h.k.). */
    secondary?: ReactNode
    /** `main` uchun qo'shimcha klasslar (fon gradienti va h.k.). */
    mainClassName?: string
    children: ReactNode
}

/**
 * Barcha ekranlar uchun umumiy karkas.
 *
 * Mobil uchun muhim qaror: sarlavha qatori HECH QACHON o'ralib ketmaydi.
 * Chapda brend (siqiladi va kesiladi), o'ngda faqat ikonkali tugmalar.
 * Sahifaga xos tugmalar esa pastdagi gorizontal siljiydigan tasmada —
 * shu tufayli tor ekranda ham baland "tugmalar ustuni" hosil bo'lmaydi.
 */
export function AppShell({
    subtitle,
    onSignOut,
    actions,
    secondary,
    mainClassName,
    children,
}: AppShellProps) {
    const { t } = useT()
    const navigate = useNavigate()

    return (
        <div className="flex min-h-screen flex-col bg-surface">
            <header className="sticky top-0 z-30 border-b border-border-base bg-surface-card/82 shadow-[0_18px_55px_-45px_var(--fg)] backdrop-blur-xl">
                <div className="flex items-center gap-2 px-4 py-2.5 sm:px-8">
                    <Brand subtitle={subtitle} className="min-w-0 [&>span:last-child]:truncate" />

                    <div className="ml-auto flex shrink-0 items-center gap-1.5">
                        <ThemeToggle />
                        <IconButton label={t('nav.settings')} onClick={() => navigate('/settings')}>
                            <SettingsIcon />
                        </IconButton>
                        <IconButton label={t('common.signOut')} onClick={onSignOut}>
                            <SignOutIcon />
                        </IconButton>
                    </div>
                </div>

                {actions && (
                    <div className="-mx-px flex gap-2 overflow-x-auto px-4 pb-2.5 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {actions}
                    </div>
                )}

                {secondary && <div className="px-4 pb-2.5 sm:px-8">{secondary}</div>}
            </header>

            <main className={cn('flex-1 bg-surface px-4 py-6 pb-16 sm:px-8', mainClassName)}>{children}</main>
        </div>
    )
}
