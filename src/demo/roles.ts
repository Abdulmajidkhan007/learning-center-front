export type DemoRole = 'ADMINISTRATOR' | 'TEACHER' | 'STUDENT'

export const DEMO_ROLES: { value: DemoRole; label: string }[] = [
    { value: 'ADMINISTRATOR', label: 'Administrator' },
    { value: 'TEACHER', label: 'Teacher' },
    { value: 'STUDENT', label: 'Student' },
]
