import { apiFetch } from '@/shared/api'
import type { GroupDto, MyAttendanceDto, StudentDto } from '@/shared/types'

const GROUP_ENDPOINT = '/group'
const ATTENDANCE_ENDPOINT = '/attendance'
const STUDENT_ENDPOINT = '/student'

/**
 * Kirgan o'quvchining o'z yozuvi.
 *
 * Ilgari bu ma'lumot `/student/phone` orqali — telefon raqami bo'yicha
 * QIDIRIB olinardi, chunki o'quvchining `studentId` sini bilishning boshqa
 * yo'li yo'q edi. U endpoint adminlar uchun mo'ljallangan va o'quvchiga
 * 403 qaytarardi, ya'ni blok jimgina bo'sh qolardi. Backend `/student/me`
 * ni qo'shgach, o'sha vaqtinchalik yechim olib tashlandi.
 */
export function fetchMyStudent(token: string, groupId: string) {
    return apiFetch<StudentDto>(`${STUDENT_ENDPOINT}/me`, { token, params: { groupId } })
}

/**
 * Kirgan o'quvchining o'z guruhlari.
 *
 * Diqqat: backendda hozir bu yo'l ikki marta "group" bilan noto'g'ri
 * ro'yxatlangan (`/group/group/my`) — backend jamoasi tuzatishni va'da
 * qildi, shuning uchun bu yerda TO'G'RI yo'l yozilgan: `/group/my`.
 */
export async function fetchMyGroups(token: string): Promise<GroupDto[]> {
    return (await apiFetch<GroupDto[]>(`${GROUP_ENDPOINT}/my`, { token })) ?? []
}

/** Tanlangan guruh bo'yicha kirgan o'quvchining o'z davomati. */
export async function fetchMyAttendance(
    token: string,
    groupId: string,
    previousMonths: number
): Promise<MyAttendanceDto[]> {
    return (
        (await apiFetch<MyAttendanceDto[]>(`${ATTENDANCE_ENDPOINT}/my/${groupId}`, {
            token,
            params: { previousMonths },
        })) ?? []
    )
}
