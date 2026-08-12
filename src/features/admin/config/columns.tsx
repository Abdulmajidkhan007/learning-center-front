import type { ReactNode } from 'react'
import type { TranslationKey } from '@/shared/i18n'
import { GroupStatusBadge } from '../components/GroupStatusBadge'
import { TimetableCell } from '../components/TimetableCell'
import type { AdminRow, EntityKey } from '../types'

export interface ColumnConfig {
    key: string
    labelKey: TranslationKey
    /** Oddiy qiymat — matnga aylantiriladi. */
    get?: (row: AdminRow) => unknown
    /** Murakkab katak — o'zi JSX qaytaradi. */
    render?: (row: AdminRow) => ReactNode
}

/**
 * Ustunlar formadagi maydonlarni takrorlaydi — shunda jadvalda ichma-ich
 * obyektlarning JSON dumpi emas, haqiqiy qiymatlar ko'rinadi.
 *
 * Bu yerda yo'q entity (`lessons`) uchun ustunlar mavjud qatorlarning
 * kalitlaridan avtomatik chiqariladi.
 */
export const COLUMN_CONFIGS: Partial<Record<EntityKey, ColumnConfig[]>> = {
    students: [
        { key: 'fullName', labelKey: 'field.fullName', get: (row) => row.userDto?.fullName },
        { key: 'phone', labelKey: 'field.phone', get: (row) => row.userDto?.phone },
        { key: 'birthDate', labelKey: 'field.birthDate', get: (row) => row.userDto?.birthDate },
        { key: 'parentPhone', labelKey: 'field.parentPhone', get: (row) => row.parentPhone },
    ],
    teachers: [
        { key: 'fullName', labelKey: 'field.fullName', get: (row) => row.userDto?.fullName },
        { key: 'phone', labelKey: 'field.phone', get: (row) => row.userDto?.phone },
        { key: 'birthDate', labelKey: 'field.birthDate', get: (row) => row.userDto?.birthDate },
    ],
    groups: [
        { key: 'name', labelKey: 'field.groupName', get: (row) => row.name },
        { key: 'room', labelKey: 'field.room', get: (row) => row.room },
        { key: 'teacher', labelKey: 'field.teacher', get: (row) => row.teacher?.userDto?.fullName },
        { key: 'timetable', labelKey: 'field.days', render: (row) => <TimetableCell timeTable={row.timeTable} /> },
        { key: 'status', labelKey: 'field.status', render: (row) => <GroupStatusBadge status={row.status} /> },
    ],
}

/** Mavjud qatorlardan ustun kalitlarini chiqaradi (konfiguratsiyasiz rejim). */
export function inferColumns(rows: AdminRow[]): string[] {
    const keys = new Set<string>()
    rows.forEach((row) => Object.keys(row).forEach((key) => keys.add(key)))
    keys.delete('id')
    return Array.from(keys)
}
