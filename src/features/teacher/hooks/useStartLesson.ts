import { useMutation } from '@tanstack/react-query'
import { startLesson, type StartLessonPayload } from '../api/teacherApi'
import type { LessonDto } from '@/shared/types'

export function useStartLesson(token: string, onStarted: (lesson: LessonDto | null) => void) {
    return useMutation({
        mutationFn: (payload: StartLessonPayload) => startLesson(token, payload),
        onSuccess: onStarted,
    })
}
