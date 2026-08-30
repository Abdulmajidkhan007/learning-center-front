export interface GroupLevelFormInput {
    id?: string
    name: string
    lessonCount: string
    orderNumber: string
    durationInMonths: string
}

export interface GroupLevelCreatePayload {
    name: string
    lessonCount: number
    orderNumber: number
    durationInMonths: number
}

export interface GroupLevelUpdatePayload extends GroupLevelCreatePayload {
    id: string
}

function parsePositiveNumber(raw: string): number {
    const sanitized = raw.trim()
    if (sanitized === '') return 0
    const value = Number.parseInt(sanitized, 10)
    return Number.isFinite(value) ? value : 0
}

export function toCreateGroupLevelPayload(values: GroupLevelFormInput): GroupLevelCreatePayload {
    return {
        name: values.name.trim(),
        lessonCount: parsePositiveNumber(values.lessonCount),
        orderNumber: parsePositiveNumber(values.orderNumber),
        durationInMonths: parsePositiveNumber(values.durationInMonths),
    }
}

export function toUpdateGroupLevelPayload(values: GroupLevelFormInput): GroupLevelUpdatePayload {
    return {
        id: values.id ?? '',
        ...toCreateGroupLevelPayload(values),
    }
}
