import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { Panel } from '@/shared/ui'

interface SuperAdminOnboardingStepsProps {
    branchCount: number
    adminCount: number
    onOpenBranches: () => void
}

interface StepItem {
    id: string
    titleKey: 'superAdmin.onboarding.step.branch' | 'superAdmin.onboarding.step.admin'
    isCompleted: boolean
    onClick: () => void
}

/**
 * Super-admin uchun dastlabki sozlash qadamlari:
 * 1. Filial qo'shish
 * 2. Administrator qo'shish
 *
 * "Tashkilot ma'lumotlarini to'ldirish" ATAYLAB yo'q: tashkilotni
 * dasturchi ochadi va unga faqat nom kerak. Qolgan ma'lumotni egasi
 * xohlagan paytida "Tashkilot" bo'limidan kiritadi — birinchi kundayoq
 * majburlash ortiqcha.
 *
 * Ikkala qadam bajarilgach blok umuman ko'rsatilmaydi.
 */
export function SuperAdminOnboardingSteps({
    branchCount,
    adminCount,
    onOpenBranches,
}: SuperAdminOnboardingStepsProps) {
    const { t } = useT()

    const steps: StepItem[] = [
        {
            id: 'branch',
            titleKey: 'superAdmin.onboarding.step.branch',
            isCompleted: branchCount > 0,
            onClick: onOpenBranches,
        },
        {
            id: 'admin',
            titleKey: 'superAdmin.onboarding.step.admin',
            isCompleted: adminCount > 0,
            // Administrator administrator panelida qo'shiladi; bu yerda
            // faqat "qilindimi" belgisi ko'rsatiladi.
            onClick: () => {},
        },
    ]

    const allCompleted = steps.every((s) => s.isCompleted)
    if (allCompleted) {
        return null
    }

    const nextIncompleteIndex = steps.findIndex((s) => !s.isCompleted)

    return (
        <Panel className="mb-6 border-brand/30 bg-brand/5 dark:bg-brand/10">
            <div className="mb-4">
                <h2 className="font-display text-lg font-semibold text-fg">
                    {t('superAdmin.onboarding.title')}
                </h2>
                <p className="mt-1 text-xs text-fg-muted">
                    {t('superAdmin.onboarding.description')}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {steps.map((step, index) => {
                    const isNext = index === nextIncompleteIndex

                    return (
                        <button
                            key={step.id}
                            type="button"
                            onClick={step.onClick}
                            className={cn(
                                'flex items-center gap-3 rounded-lg border p-3 text-left transition-all cursor-pointer max-sm:min-h-11',
                                step.isCompleted &&
                                    'border-border-base/50 bg-surface/50 text-fg-muted hover:bg-surface',
                                isNext &&
                                    'border-brand bg-surface font-medium shadow-sm ring-2 ring-brand/30 text-fg hover:border-brand',
                                !step.isCompleted &&
                                    !isNext &&
                                    'border-border-base bg-surface/80 text-fg-muted opacity-75 hover:opacity-100 hover:bg-surface'
                            )}
                        >
                            <span
                                className={cn(
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                                    step.isCompleted && 'bg-success/20 text-success',
                                    isNext && 'bg-brand text-brand-fg',
                                    !step.isCompleted && !isNext && 'bg-surface-hover text-fg-muted'
                                )}
                            >
                                {step.isCompleted ? (
                                    <svg
                                        className="h-3.5 w-3.5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </span>

                            <span
                                className={cn(
                                    'text-sm truncate',
                                    step.isCompleted && 'line-through text-fg-muted',
                                    isNext && 'font-medium text-fg',
                                    !step.isCompleted && !isNext && 'text-fg-muted'
                                )}
                            >
                                {t(step.titleKey)}
                            </span>
                        </button>
                    )
                })}
            </div>
        </Panel>
    )
}
