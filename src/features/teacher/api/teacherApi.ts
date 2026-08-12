import { apiFetch } from '@/shared/api'
import type { FullGroupDto, GroupDto, LessonDto } from '@/shared/types'

const GROUP_ENDPOINT = '/group'
const LESSON_ENDPOINT = '/lesson'

/**
 * Kirgan o'qituvchining o'z guruhlari.
 * TAXMIN: `/groups` va `/groupInfo` ikkalasi ham `/api/v1/group` ostida —
 * backend bilan hali tasdiqlanmagan.
 */
export async function fetchTeacherGroups(token: string): Promise<GroupDto[]> {
    return (await apiFetch<GroupDto[]>(`${GROUP_ENDPOINT}/groups`, { token })) ?? []
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
