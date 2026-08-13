import { apiFetch } from '@/shared/api'
import type { FullGroupDto, GroupNameDto, LessonDto } from '@/shared/types'

const GROUP_ENDPOINT = '/group'
const LESSON_ENDPOINT = '/lesson'

/**
 * Kirgan o'qituvchining o'z guruhlari.
 *
 * To'liq `GroupDto` emas: backend `GroupNameProjection` qaytaradi, ya'ni
 * faqat `id` va `name`. Guruhning jadvali va ro'yxati kerak bo'lsa —
 * `/group/groupInfo`.
 */
export async function fetchTeacherGroups(token: string): Promise<GroupNameDto[]> {
    return (await apiFetch<GroupNameDto[]>(`${GROUP_ENDPOINT}/groups`, { token })) ?? []
}

export function fetchGroupInfo(token: string, groupId: string) {
    return apiFetch<FullGroupDto>(`${GROUP_ENDPOINT}/groupInfo`, { token, params: { groupId } })
}

export interface StartLessonPayload {
    groupId: string
    lessonName: string
}

export function startLesson(token: string, payload: StartLessonPayload) {
    return apiFetch<LessonDto>(LESSON_ENDPOINT, { method: 'POST', token, body: payload })
}
