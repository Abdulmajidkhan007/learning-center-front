import { useT } from '@/shared/i18n'
import { Avatar, Eyebrow, Panel } from '@/shared/ui'
import { formatTime } from '@/shared/lib'
import type { GroupDto, UserDto } from '@/shared/types'

interface ProfileHeaderProps {
    user: UserDto
    /** Tanlangan guruh — bo'lmasa daraja/guruh bloki bo'sh chiziladi. */
    group?: GroupDto
}

/** Profil ekranining yuqori qismi: avatar, ism, telefon, daraja va guruh. */
export function ProfileHeader({ user, group }: ProfileHeaderProps) {
    const { t } = useT()
    const timeTable = group?.timeTable

    return (
        <Panel className="mb-5 flex flex-col items-center text-center">
            <Avatar name={user.fullName} src={user.imageUrl} size="lg" fallback="silhouette" />

            <h2 className="mt-3 font-display text-xl font-semibold text-fg">{user.fullName || '—'}</h2>
            <p className="mt-1 text-sm text-fg-muted">{user.phone || '—'}</p>

            <div className="mt-5 grid w-full grid-cols-2 gap-4 border-t border-border-base pt-5">
                <div>
                    <Eyebrow>{t('student.levelLabel')}</Eyebrow>
                    <p className="mt-1 text-sm font-medium text-fg">{group?.level?.name || '—'}</p>
                </div>
                <div>
                    <Eyebrow>{t('student.groupLabel')}</Eyebrow>
                    <p className="mt-1 text-sm font-medium text-fg">{group?.name || '—'}</p>
                    {timeTable?.startTime && (
                        <p className="mt-0.5 font-mono text-[0.68rem] text-fg-faint">
                            {timeTable.dayType && t(`group.dayType.${timeTable.dayType}`)}
                            {' · '}
                            {formatTime(timeTable.startTime)}–{formatTime(timeTable.endTime)}
                        </p>
                    )}
                </div>
            </div>
        </Panel>
    )
}
