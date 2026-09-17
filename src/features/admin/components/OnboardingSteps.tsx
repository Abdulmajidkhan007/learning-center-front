import { useNavigate } from 'react-router-dom'
import { useT } from '@/shared/i18n'
import { cn } from '@/shared/lib'
import { Panel } from '@/shared/ui'
import type { EntityKey } from '../types'

interface OnboardingStepsProps {
    levelCount: number
    teacherCount: number
    groupCount: number
    studentCount: number
    onTabChange: (tab: EntityKey) => void
}

interface StepItem {
    id: string
    titleKey: 'onboarding.step.level' | 'onboarding.step.teacher' | 'onboarding.step.group' | 'onboarding.step.student'
    isCompleted: boolean
    onClick: () => void
}

/**
 * Yangi tashkilot yaratilganda administrator uchun dastlabki sozlash qadamlari ko'rsatiladi.
 *
 * Qadamlar tartibi qat'iy:
 * 1. Daraja (kurs) qo'shish -> /group-levels
 * 2. O'qituvchi qo'shish -> Teachers tabi
 * 3. Guruh yaratish -> Groups tabi
 * 4. O'quvchi qo'shish -> Students tabi
 *
 * Barcha 4 qadam bajarilgach, bu blok butunlay yashiriladi.
 */
export function OnboardingSteps({
    levelCount,
    teacherCount,
    groupCount,
    studentCount,
    onTabChange,
}: OnboardingStepsProps) {
    const { t } = useT()
    const navigate = useNavigate()

    const steps: StepItem[] = [
        {
            id: 'level',
            titleKey: 'onboarding.step.level',
            isCompleted: levelCount > 0,
            onClick: () => navigate('/group-levels'),
        },
        {
            id: 'teacher',
            titleKey: 'onboarding.step.teacher',
            isCompleted: teacherCount > 0,
            onClick: () => onTabChange('teachers'),
        },
        {
            id: 'group',
            titleKey: 'onboarding.step.group',
            isCompleted: groupCount > 0,
            onClick: () => onTabChange('groups'),
        },
        {
            id: 'student',
            titleKey: 'onboarding.step.student',
            isCompleted: studentCount > 0,
            onClick: () => onTabChange('students'),
        },
    ]

    // Barcha 4 ta qadam bajarilgan bo'lsa, blokni umuman ko'rsatmaymiz.
    const allCompleted = steps.every((s) => s.isCompleted)
    if (allCompleted) {
        return null
    }

    // Navbatdagi bajarilmagan birinchi qadam indeksini topamiz.
    const nextIncompleteIndex = steps.findIndex((s) => !s.isCompleted)

    return (
        <Panel className="mb-6 border-brand/30 bg-brand/5 dark:bg-brand/10">
            <div className="mb-4">
                <h2 className="font-display text-lg font-semibold text-fg">{t('onboarding.title')}</h2>
                <p className="mt-1 text-xs text-fg-muted">{t('onboarding.description')}</p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
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
                                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
