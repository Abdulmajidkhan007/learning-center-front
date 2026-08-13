import { apiFetch } from '@/shared/api'
import type { StudentDto } from '@/shared/types'

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
