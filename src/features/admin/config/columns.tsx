import type { ReactNode } from 'react'
import { GroupStatusBadge } from '../components/GroupStatusBadge'
import { TimetableCell } from '../components/TimetableCell'
import type { AdminRow, EntityKey } from '../types'

export interface ColumnConfig {
    key: string
    label: string
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
        { key: 'fullName', label: 'Full name', get: (row) => row.userDto?.fullName },
        { key: 'phone', label: 'Phone', get: (row) => row.userDto?.phone },
        { key: 'birthDate', label: 'Birth date', get: (row) => row.userDto?.birthDate },
        { key: 'parentPhone', label: 'Parent phone', get: (row) => row.parentPhone },
    ],
    teachers: [
        { key: 'fullName', label: 'Full name', get: (row) => row.userDto?.fullName },
        { key: 'phone', label: 'Phone', get: (row) => row.userDto?.phone },
        { key: 'birthDate', label: 'Birth date', get: (row) => row.userDto?.birthDate },
    ],
    groups: [
        { key: 'name', label: 'Group name', get: (row) => row.name },
        { key: 'room', label: 'Room', get: (row) => row.room },
        { key: 'teacher', label: 'Teacher', get: (row) => row.teacher?.userDto?.fullName },
        { key: 'timetable', label: 'Timetable', render: (row) => <TimetableCell timeTable={row.timeTable} /> },
        { key: 'status', label: 'Status', render: (row) => <GroupStatusBadge status={row.status} /> },
    ],
}

/** Mavjud qatorlardan ustun kalitlarini chiqaradi (konfiguratsiyasiz rejim). */
export function inferColumns(rows: AdminRow[]): string[] {
    const keys = new Set<string>()
    rows.forEach((row) => Object.keys(row).forEach((key) => keys.add(key)))
    keys.delete('id')
    return Array.from(keys)
}
