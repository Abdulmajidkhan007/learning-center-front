import { useT } from '@/shared/i18n'
import { Badge } from '@/shared/ui'

/**
 * Dars tugagan-tugamaganini ko'rsatadi.
 *
 * `undefined` — "noma'lum", `false` dan farq qiladi: backend hozircha
 * `isComplete` ni umuman to'ldirmayapti (`docs/backend-notes.md`), shuning
 * uchun uni "davom etmoqda" deb ko'rsatish yolg'on bo'lardi.
 */
export function LessonStatusBadge({ isComplete }: { isComplete?: boolean }) {
    const { t } = useT()
    if (isComplete === undefined || isComplete === null) {
        return <span className="text-fg-faint">—</span>
    }
    return (
        <Badge tone={isComplete ? 'sage' : 'amber'}>
            {isComplete ? t('lesson.complete') : t('lesson.ongoing')}
        </Badge>
    )
}
