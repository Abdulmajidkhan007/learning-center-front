import type { EntityConfig, EntityKey } from '../types'

/** Chap ustundagi bo'limlar va ular tegishli endpoint'lar. */
export const ENTITIES: EntityConfig[] = [
    { key: 'students', label: 'Students', endpoint: '/student' },
    { key: 'teachers', label: 'Teachers', endpoint: '/teacher' },
    { key: 'groups', label: 'Groups', endpoint: '/group' },
    { key: 'lessons', label: 'Lessons', endpoint: '/lesson' },
]

export function entityByKey(key: EntityKey): EntityConfig {
    // `!` — key tipi EntityKey, ya'ni ro'yxatda albatta bor.
    return ENTITIES.find((entity) => entity.key === key)!
}

/** Statistika kartalarining yuqori chizig'i rangi. */
export const ENTITY_ACCENT: Record<EntityKey, string> = {
    students: 'border-t-danger',
    teachers: 'border-t-success',
    groups: 'border-t-amber',
    lessons: 'border-t-steel',
}

export const PAGE_SIZE = 10
