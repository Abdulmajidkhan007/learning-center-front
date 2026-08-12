export type PasswordIssue = 'empty' | 'tooShort' | 'mismatch' | null

/**
 * Parol o'zgartirish formasining mijoz tomonidagi tekshiruvi.
 *
 * Sof funksiya — komponentdan ajratilgan, chunki bu yagona haqiqiy mantiq
 * va uni DOM'siz test qilish mumkin. Backend baribir o'z tekshiruvini
 * qiladi; bu faqat foydalanuvchini bekorga kutkazmaslik uchun.
 */
export function validatePasswordChange(input: {
    current: string
    next: string
    repeat: string
}): PasswordIssue {
    if (!input.current || !input.next || !input.repeat) return 'empty'
    if (input.next.length < 8) return 'tooShort'
    if (input.next !== input.repeat) return 'mismatch'
    return null
}
