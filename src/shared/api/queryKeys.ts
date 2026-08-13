/**
 * TanStack Query kalitlari — bitta joyda.
 *
 * Nega markazlashtirildi: mutatsiyadan keyin `invalidateQueries` chaqirganda
 * kalit satrini qo'lda yozish eng ko'p uchraydigan xato manbai. Bu yerdan
 * olinsa, kalit o'zgarsa hamma joyda bir vaqtda o'zgaradi.
 */
export const queryKeys = {
    /** Admin jadvali: entity + sahifalash/filtr holati. */
    entityList: (entity: string, params: Record<string, unknown>) =>
        ['entity', entity, 'list', params] as const,
    entityCount: (entity: string) => ['entity', entity, 'count'] as const,

    me: () => ['auth', 'me'] as const,
    myStudentRecord: (phone: string) => ['student', 'byPhone', phone] as const,

    teacherOptions: () => ['teacher', 'options'] as const,
    groupOptions: () => ['group', 'options'] as const,

    groupEnrollments: (groupId: string) => ['enrollments', groupId] as const,

    teacherGroups: () => ['teacher', 'groups'] as const,
    groupInfo: (groupId: string) => ['group', 'info', groupId] as const,

    attendance: () => ['attendance', 'list'] as const,

    invoices: (params: Record<string, unknown>) => ['invoice', 'list', params] as const,
} as const
