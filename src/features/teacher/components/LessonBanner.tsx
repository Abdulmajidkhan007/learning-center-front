import { useT } from '@/shared/i18n'
import { Button } from '@/shared/ui'
import type { LessonDto } from '@/shared/types'

/** Dars boshlangani haqidagi banner + davomatga o'tish tugmasi. */
export function LessonBanner({ lesson, onMarkAttendance }: { lesson: LessonDto; onMarkAttendance: () => void }) {
    const { t } = useT()

    return (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-lg border border-success/30 bg-success-soft px-4 py-3.5">
            <span className="inline-flex -rotate-2 shrink-0 rounded-sm border-[1.5px] border-success px-2 py-0.5 font-mono text-[0.62rem] tracking-[0.05em] text-success-fg uppercase">
                {t('teacher.inProgress')}
            </span>
            <div className="min-w-40 flex-1">
                <div className="font-display text-base font-semibold text-fg">
                    {t('teacher.lessonStarted', { number: lesson.lessonNumber ?? '' })}
                </div>
                <div className="mt-0.5 text-sm tabular-nums text-fg-muted">{lesson.lessonDate}</div>
            </div>
            <Button variant="success" size="sm" onClick={onMarkAttendance}>
                {t('teacher.markAttendance')}
            </Button>
        </div>
    )
}
