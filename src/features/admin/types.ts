import type { TranslationKey } from '@/shared/i18n'
import type { GroupStatus, TeacherDto, TimeTableDto, UserDto } from '@/shared/types'

export type EntityKey = 'students' | 'teachers' | 'groups' | 'lessons'

export interface EntityConfig {
    key: EntityKey
    /** Ko'plik va birlik alohida: rus tilida ular boshqacha turlanadi. */
    pluralKey: TranslationKey
    singularKey: TranslationKey
    endpoint: string
}

/**
 * Admin jadvalining bitta qatori.
 *
 * Bu sahifa to'rt xil DTO'ni BITTA generik jadvalda ko'rsatadi, shuning uchun
 * qator tipi — o'sha DTO'lar maydonlarining birlashmasi, plus konfiguratsiyasiz
 * (avtomatik) rejim uchun indeks imzosi. Hammasi optional, chunki qaysi
 * maydon kelishi ochiq turgan tabga bog'liq.
 */
export interface AdminRow {
    id: string
    userDto?: UserDto
    parentPhone?: string
    name?: string
    room?: string
    teacher?: TeacherDto
    timeTable?: TimeTableDto
    status?: GroupStatus
    [key: string]: unknown
}

/**
 * Forma qiymatlari `unknown`: konfiguratsiyasiz rejimda qatorning istalgan
 * maydoni formaga tushadi, ichma-ich obyektlar ham. Ular render paytida
 * stringga aylantiriladi, state'da esa asl ko'rinishida qoladi.
 */
export type FormValues = Record<string, unknown>

export type FormFieldType = 'text' | 'tel' | 'date' | 'time' | 'select'

export interface FormField {
    key: string
    labelKey: TranslationKey
    type: FormFieldType
    options?: { value: string; labelKey: TranslationKey }[]
    /** Variantlar serverdan kelsa (masalan o'qituvchilar ro'yxati). */
    optionsSource?: 'teachers'
}

export type ModalMode = 'create' | 'edit'

export interface EntityFormConfig {
    fields: FormField[] | ((mode: ModalMode) => FormField[])
    getInitialValues: (row: AdminRow | null) => FormValues
    /** Create va Update DTO'lari har xil bo'lgani uchun ikkita alohida funksiya. */
    buildCreatePayload: (values: FormValues) => unknown
    buildUpdatePayload: (values: FormValues) => unknown
}
