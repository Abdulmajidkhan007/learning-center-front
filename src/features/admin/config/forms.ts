import { formatTime } from '@/shared/lib'
import { GROUP_STATUSES } from '@/shared/types'
import { titleCase } from '@/shared/lib'
import type { EntityFormConfig, EntityKey, FormField } from '../types'

const STATUS_OPTIONS = GROUP_STATUSES.map((status) => ({ value: status, label: titleCase(status) }))

/**
 * Create/Update DTO'si o'qish DTO'siga MOS KELMAYDIGAN entity'lar uchun
 * forma konfiguratsiyasi. Bu yerda yo'q entity'lar (hozircha `lessons`)
 * avtomatik — maydonlar mavjud qatorlardan taxmin qilinadi.
 *
 * TAXMIN: shakllar backend javoblariga qarab tiklangan. `*CreateDto` boshqa
 * ko'rinishda bo'lsa, o'zgartirish faqat SHU faylda bo'ladi.
 */
export const FORM_CONFIGS: Partial<Record<EntityKey, EntityFormConfig>> = {
    students: {
        fields: [
            { key: 'fullName', label: 'Full name', type: 'text' },
            { key: 'phone', label: 'Phone', type: 'tel' },
            { key: 'birthDate', label: 'Birth date', type: 'date' },
            { key: 'parentPhone', label: 'Parent phone', type: 'tel' },
        ],
        getInitialValues(row) {
            const user = row?.userDto ?? {}
            return {
                // `userDto` yo'q bo'lsa yassi maydonlarga tushamiz — StudentDto
                // ning aniq shakli hali tasdiqlanmagan.
                fullName: user.fullName ?? row?.fullName ?? '',
                phone: user.phone ?? row?.phone ?? '',
                birthDate: user.birthDate ?? row?.birthDate ?? '',
                parentPhone: row?.parentPhone ?? '',
            }
        },
        buildCreatePayload(values) {
            return {
                userCreateDto: {
                    fullName: values.fullName,
                    phone: values.phone,
                    birthDate: values.birthDate,
                    // `/student` orqali yaratilyapti, ya'ni rol aniq.
                    role: 'STUDENT',
                },
                parentPhone: values.parentPhone,
            }
        },
        buildUpdatePayload(values) {
            return {
                user: {
                    fullName: values.fullName,
                    phone: values.phone,
                    birthDate: values.birthDate,
                },
                parentPhone: values.parentPhone,
            }
        },
    },

    teachers: {
        fields: [
            { key: 'fullName', label: 'Full name', type: 'text' },
            { key: 'phone', label: 'Phone', type: 'tel' },
            { key: 'birthDate', label: 'Birth date', type: 'date' },
        ],
        getInitialValues(row) {
            const user = row?.userDto ?? {}
            return {
                fullName: user.fullName ?? '',
                phone: user.phone ?? '',
                birthDate: user.birthDate ?? '',
            }
        },
        buildCreatePayload(values) {
            return {
                user: {
                    fullName: values.fullName,
                    phone: values.phone,
                    birthDate: values.birthDate,
                    role: 'TEACHER',
                },
            }
        },
        buildUpdatePayload(values) {
            return {
                user: {
                    fullName: values.fullName,
                    phone: values.phone,
                    birthDate: values.birthDate,
                },
            }
        },
    },

    groups: {
        // Create va Update bir xil ichma-ich `timeTable` shaklini oladi;
        // faqat tahrirlashda `status` maydoni qo'shiladi (yaratishda backend
        // uni o'zi STARTING qilib qo'yadi).
        fields: (mode) => {
            const base: FormField[] = [
                { key: 'name', label: 'Group name', type: 'text' },
                { key: 'room', label: 'Room', type: 'text' },
                { key: 'teacherId', label: 'Teacher', type: 'select', optionsSource: 'teachers' },
                { key: 'days', label: 'Days', type: 'dayPicker' },
                { key: 'startTime', label: 'Start time', type: 'time' },
                { key: 'endTime', label: 'End time', type: 'time' },
            ]
            if (mode === 'edit') {
                base.push({ key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS })
            }
            return base
        },
        getInitialValues(row) {
            return {
                name: row?.name ?? '',
                room: row?.room ?? '',
                teacherId: row?.teacher?.id ?? '',
                days: row?.timeTable?.days ?? [],
                startTime: formatTime(row?.timeTable?.startTime),
                endTime: formatTime(row?.timeTable?.endTime),
                status: row?.status ?? 'STARTING',
            }
        },
        buildCreatePayload(values) {
            return {
                name: values.name,
                room: values.room,
                teacherId: values.teacherId,
                timeTable: {
                    days: values.days,
                    startTime: values.startTime,
                    endTime: values.endTime,
                },
            }
        },
        buildUpdatePayload(values) {
            return {
                name: values.name,
                room: values.room,
                teacherId: values.teacherId,
                timeTable: {
                    days: values.days,
                    startTime: values.startTime,
                    endTime: values.endTime,
                },
                status: values.status,
            }
        },
    },
}
