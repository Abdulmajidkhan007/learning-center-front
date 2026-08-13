import { useT } from '@/shared/i18n'
import { Avatar, Panel } from '@/shared/ui'
import type { TranslationKey } from '@/shared/i18n'
import type { StudentDto, UserDto } from '@/shared/types'

interface ProfileCardProps {
    user: UserDto
    student: StudentDto | null
}

/** O'quvchining o'z ma'lumotlari — yagona to'liq ishlaydigan blok. */
export function ProfileCard({ user, student }: ProfileCardProps) {
    const { t } = useT()

    const rows: { labelKey: TranslationKey; value?: string }[] = [
        { labelKey: 'field.phone', value: user.phone },
        { labelKey: 'field.birthDate', value: user.birthDate },
        { labelKey: 'field.parentPhone', value: student?.parentPhone },
    ]

    return (
        <Panel className="mb-5">
            <div className="mb-4 flex items-center gap-3.5">
                <Avatar name={user.fullName} src={user.imageUrl} size="lg" />
                <div className="min-w-0">
                    <h2 className="truncate font-display text-xl font-semibold text-fg">
                        {user.fullName || '—'}
                    </h2>
                    <p className="font-mono text-xs text-fg-faint">{t('student.role')}</p>
                </div>
            </div>

            <dl>
                {rows.map((row) => (
                    <div
                        key={row.labelKey}
                        className="flex items-center justify-between gap-3 border-b border-border-base py-2.5 text-sm last:border-b-0"
                    >
                        <dt className="font-mono text-[0.68rem] tracking-[0.06em] text-fg-faint uppercase">
                            {t(row.labelKey)}
                        </dt>
                        <dd className="truncate text-fg">{row.value || '—'}</dd>
                    </div>
                ))}
            </dl>
        </Panel>
    )
}
