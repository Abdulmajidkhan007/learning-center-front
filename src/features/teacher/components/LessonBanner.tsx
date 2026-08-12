import { Button } from '@/shared/ui'
import type { LessonDto } from '@/shared/types'

/** Dars boshlangani haqidagi banner + davomatga o'tish tugmasi. */
export function LessonBanner({ lesson, onMarkAttendance }: { lesson: LessonDto; onMarkAttendance: () => void }) {
    return (
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-success/30 bg-success-soft px-5 py-4">
            <span className="inline-flex -rotate-2 shrink-0 rounded-sm border-[1.5px] border-success px-2 py-0.5 font-mono text-[0.65rem] tracking-[0.05em] text-success-fg uppercase">
                In progress
            </span>
            <div className="flex-1">
                <div className="font-display text-lg font-semibold text-fg">
                    Lesson {lesson.lessonNumber} started
                </div>
                <div className="mt-0.5 text-sm text-fg-muted">{lesson.lessonDate}</div>
            </div>
            <Button variant="success" size="sm" onClick={onMarkAttendance}>
                Mark Attendance
            </Button>
        </div>
    )
}
