export type DemoRole = 'ADMINISTRATOR' | 'TEACHER' | 'STUDENT' | 'SUPER_ADMIN'

export const DEMO_ROLES: { value: DemoRole; label: string }[] = [
    { value: 'ADMINISTRATOR', label: 'Administrator' },
    { value: 'TEACHER', label: 'Teacher' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'SUPER_ADMIN', label: 'Super admin' },
]
