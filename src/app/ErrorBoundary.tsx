import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
    children: ReactNode
}

interface State {
    error: Error | null
}

/**
 * Render paytidagi xatoni ushlab qoladi.
 *
 * Busiz React butun daraxtni yechib tashlaydi va foydalanuvchi OQ EKRAN
 * ko'radi — nima bo'lganini ham, nima qilishni ham bilmaydi.
 *
 * Ataylab class komponent: React'da xato chegarasini hook bilan yozib
 * bo'lmaydi. Matni ham ataylab tarjimasiz — bu yerga tushganda kontekst
 * (til provideri ham) buzilgan bo'lishi mumkin.
 */
export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null }

    static getDerivedStateFromError(error: Error): State {
        return { error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Xato monitoringi qo'shilganda (Sentry va h.k.) shu yerga ulanadi.
        console.error('Unhandled render error:', error, info.componentStack)
    }

    render() {
        if (!this.state.error) return this.props.children

        return (
            <div className="flex min-h-screen items-center justify-center bg-surface p-6">
                <div className="w-full max-w-md rounded-lg border border-border-base bg-surface-card p-6 text-center">
                    <p className="font-mono text-[0.62rem] tracking-[0.08em] text-fg-faint uppercase">
                        Xatolik / Ошибка / Error
                    </p>
                    <h1 className="mt-2 font-display text-xl font-semibold text-fg">
                        Nimadir buzildi
                    </h1>
                    <p className="mt-2 text-sm text-fg-muted">
                        Sahifani yangilang. Takrorlansa, quyidagi matnni yuboring.
                    </p>
                    <pre className="mt-4 max-h-32 overflow-auto rounded-md bg-surface p-3 text-left font-mono text-[0.7rem] text-fg-muted">
                        {this.state.error.message}
                    </pre>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-4 cursor-pointer rounded-md bg-fg px-4 py-2 text-sm text-fg-inverted"
                    >
                        Yangilash
                    </button>
                </div>
            </div>
        )
    }
}
