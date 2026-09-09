import { useT } from '@/shared/i18n'
import { cn, formatAmount } from '@/shared/lib'
import { EmptyState, Eyebrow, Panel, PendingBackend } from '@/shared/ui'
import type { StudentDto } from '@/shared/types'

interface BalanceCardProps {
    /** `null` — guruh tanlanmagan (o'quvchi hech qaysi guruhda emas). */
    student: StudentDto | null
    hasGroup: boolean
}

/**
 * Tanlangan guruh bo'yicha balans.
 *
 * Balans `paidAmount - monthlyFee` — ya'ni MANFIY son qarzni bildiradi.
 * Shuning uchun manfiy qiymat qizil rangda: o'quvchi buni birinchi
 * qarashda ko'rishi kerak.
 */
export function BalanceCard({ student, hasGroup }: BalanceCardProps) {
    const { t } = useT()

    return (
        <Panel>
            <Eyebrow>{t('student.balance')}</Eyebrow>
            <p className="mt-1 mb-4 text-sm text-fg-muted">{t('student.balanceHint')}</p>

            {!hasGroup && <EmptyState title={t('student.noGroups')} />}

            {/* Guruh bor, lekin balans kelmagan — backend javobi to'liq emas. */}
            {hasGroup && student?.balance === undefined && <PendingBackend />}

            {hasGroup && student?.balance !== undefined && (
                <span
                    className={cn(
                        'block font-display text-3xl font-semibold tabular-nums',
                        student.balance < 0 ? 'text-danger-fg' : 'text-fg'
                    )}
                >
                    {formatAmount(student.balance)}
                </span>
            )}
        </Panel>
    )
}
