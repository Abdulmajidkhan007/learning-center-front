import { Brand, ThemeToggle } from '@/shared/ui'
import { LoginForm } from '../components/LoginForm'
import type { Session } from '@/shared/types'

/**
 * Ikki ustunli kirish sahifasi. Chapda forma, o'ngda "daftar" bezagi —
 * o'ng ustun kichik ekranlarda butunlay yashiriladi (`hidden lg:flex`).
 */
export function LoginPage({ onLoggedIn }: { onLoggedIn: (session: Session) => void }) {
    return (
        <div className="grid min-h-screen lg:grid-cols-[minmax(360px,460px)_1fr]">
            <div className="flex flex-col justify-center bg-surface px-8 py-12 sm:px-14">
                <div className="mb-10 flex items-center justify-between">
                    <Brand subtitle="Cornerstone Learning Centre" />
                    <ThemeToggle />
                </div>

                <h1 className="mb-2 font-display text-4xl font-semibold tracking-tight text-fg">
                    Welcome back to class.
                </h1>
                <p className="mb-8 text-fg-muted">Sign in to pick up where you left off.</p>

                <LoginForm onLoggedIn={onLoggedIn} />
            </div>

            <div className="relative hidden items-end overflow-hidden bg-sidebar p-14 lg:flex">
                {/* Daftar chiziqlari — sof bezak, shuning uchun aria-hidden */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_27px,rgba(250,246,238,0.08)_28px)]"
                />
                <div className="relative max-w-sm">
                    <span className="mb-4 inline-flex -rotate-2 rounded-sm border-[1.5px] border-brand px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.05em] text-brand uppercase">
                        Est. semester one
                    </span>
                    <p className="font-display text-2xl leading-snug text-sidebar-fg/90 italic">
                        "A record of every course, every cohort, every quiet bit of progress — kept the
                        way a good registrar keeps a ledger."
                    </p>
                </div>
            </div>
        </div>
    )
}
