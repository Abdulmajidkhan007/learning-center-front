import { formatTime } from '@/shared/lib'
import { DAY_TYPES, GROUP_STATUSES } from '@/shared/types'
import type { EntityFormConfig, EntityKey, FormField } from '../types'

const STATUS_OPTIONS = GROUP_STATUSES.map((status) => ({
    value: status,
    labelKey: `status.${status}` as const,
}))

/** Backend kunlar ro'yxatini emas, ODD/EVEN ni saqlaydi. */
const DAY_TYPE_OPTIONS = DAY_TYPES.map((dayType) => ({
    value: dayType,
    labelKey: `group.dayType.${dayType}` as const,
}))

/**
 * Create/Update DTO'si o'qish DTO'siga MOS KELMAYDIGAN entity'lar uchun
 * forma konfiguratsiyasi. Bu yerda yo'q entity avtomatik ishlaydi —
 * maydonlar mavjud qatorlardan taxmin qilinadi.
 *
 * Shakllar `goodman113/learning_center` dagi `*CreateDto` / `*UpdateDto`
 * record'laridan olingan. Backend o'zgarsa, o'zgartirish faqat SHU faylda.
 */
export const FORM_CONFIGS: Partial<Record<EntityKey, EntityFormConfig>> = {
    students: {
        fields: [
            { key: 'fullName', labelKey: 'field.fullName', type: 'text' },
            { key: 'phone', labelKey: 'field.phone', type: 'tel' },
            { key: 'birthDate', labelKey: 'field.birthDate', type: 'date' },
            { key: 'parentPhone', labelKey: 'field.parentPhone', type: 'tel' },
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
            { key: 'fullName', labelKey: 'field.fullName', type: 'text' },
            { key: 'phone', labelKey: 'field.phone', type: 'tel' },
            { key: 'birthDate', labelKey: 'field.birthDate', type: 'date' },
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
                { key: 'name', labelKey: 'field.groupName', type: 'text' },
                { key: 'room', labelKey: 'field.room', type: 'text' },
                { key: 'teacherId', labelKey: 'field.teacher', type: 'select', optionsSource: 'teachers' },
                { key: 'dayType', labelKey: 'field.dayType', type: 'select', options: DAY_TYPE_OPTIONS },
                { key: 'startTime', labelKey: 'field.startTime', type: 'time' },
                { key: 'endTime', labelKey: 'field.endTime', type: 'time' },
            ]
            if (mode === 'edit') {
                base.push({ key: 'status', labelKey: 'field.status', type: 'select', options: STATUS_OPTIONS })
            }
            return base
        },
        getInitialValues(row) {
            return {
                name: row?.name ?? '',
                room: row?.room ?? '',
                teacherId: row?.teacher?.id ?? '',
                dayType: row?.timeTable?.dayType ?? 'ODD',
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
                    dayType: values.dayType,
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
                    dayType: values.dayType,
                    startTime: values.startTime,
                    endTime: values.endTime,
                },
                status: values.status,
            }
        },
    },

    lessons: {
        // `LessonCreateDto{groupId, lessonName}` va `LessonUpdateDto{lessonName}`:
        // guruh faqat yaratishda tanlanadi, keyin uni almashtirib bo'lmaydi.
        fields: (mode) => {
            const name: FormField = { key: 'lessonName', labelKey: 'field.lessonName', type: 'text' }
            if (mode === 'edit') return [name]
            return [
                { key: 'groupId', labelKey: 'field.groupName', type: 'select', optionsSource: 'groups' },
                name,
            ]
        },
        getInitialValues(row) {
            return {
                groupId: row?.group?.id ?? '',
                // `LessonDto` dars nomini qaytarmaydi (`lessonNumber` bo'sh
                // keladi) — shuning uchun tahrirlashda maydon odatda bo'sh
                // boshlanadi. Backend tuzatilgach o'zi to'ladi.
                lessonName: row?.lessonNumber ?? '',
            }
        },
        buildCreatePayload(values) {
            return {
                groupId: values.groupId,
                lessonName: values.lessonName,
            }
        },
        buildUpdatePayload(values) {
            return { lessonName: values.lessonName }
        },
    },
}
