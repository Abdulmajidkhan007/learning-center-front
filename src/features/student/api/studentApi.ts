import { apiFetch } from '@/shared/api'
import type { GroupDto, MyAttendanceDto, StudentBalanceDto, StudentDto } from '@/shared/types'

const GROUP_ENDPOINT = '/group'
const ATTENDANCE_ENDPOINT = '/attendance'
const STUDENT_ENDPOINT = '/student'

/**
 * O'quvchini telefon raqami bo'yicha topadi.
 *
 * Nega aynan shu endpoint: o'quvchining o'z `studentId` sini bilishning
 * boshqa yo'li yo'q (`/auth/me` foydalanuvchi id sini beradi, o'quvchi
 * id sini emas). Butun ro'yxatni yuklab, ichidan o'zini qidirish esa
 * boshqalarning ma'lumotini ham yuklab olish demak — shuning uchun
 * bunday qilinmadi.
 */
export async function fetchStudentByPhone(token: string, phone: string): Promise<StudentDto | null> {
    const found = await apiFetch<StudentDto[]>('/student/phone', { token, params: { phone } })
    return found?.[0] ?? null
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

/**
 * O'quvchining balansi.
 *
 * Endpoint hali backendda yo'q — bu funksiya hozircha hech qayerdan
 * chaqirilmaydi (`useMyBalance` ga qarang). Endpoint kelganda tayyor turadi.
 */
export function fetchMyBalance(token: string) {
    return apiFetch<StudentBalanceDto>(`${STUDENT_ENDPOINT}/my/balance`, { token })
}
