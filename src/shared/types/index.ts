/**
 * Backend DTO shakllari — bitta joyda.
 *
 * Bu shakllar `goodman113/learning_center` repo'sidagi haqiqiy Java
 * record'laridan olingan (2026-08-13 holatiga). Ilgari ular fetch
 * chaqiruvlaridan taxmin qilingan edi; farq bo'lgan joylar tuzatildi.
 *
 * Maydonlar hamon optional: backend `null` qaytarishi mumkin va Java
 * record'i buni ko'rsatmaydi.
 */

/** Spring Data `Page<T>` javobi. */
export interface Page<T> {
    content?: T[]
    totalPages?: number
    totalElements?: number
}

/**
 * JWT ichidagi claim'lar. `role` ataylab oddiy string: backend yangi rol
 * qo'shsa build yiqilmasligi, balki App'dagi `default` shoxiga tushishi kerak.
 */
export interface JwtClaims {
    role?: string
    [claim: string]: unknown
}

/** Tizimga kirgan foydalanuvchi sessiyasi. */
export interface Session {
    token: string
    role: string
    claims: JwtClaims
}

/**
 * `POST /auth/login` va `/auth/refresh-token` javobi.
 *
 * Refresh token javob TANASIDA kelmaydi — backend uni httpOnly
 * `refresh_token` cookie'siga yozadi (`AuthService.setRefreshCookie`).
 */
export interface AuthResponse {
    token: string
    expiry?: string
}

export interface LoginCredentials {
    phone: string
    password: string
    rememberMe: boolean
}

export type Role = 'SUPER_ADMIN' | 'ADMINISTRATOR' | 'TEACHER' | 'STUDENT'

/** `UserDto` — diqqat: maydon nomi `imageUrl` (`imgUrl` emas). */
export interface UserDto {
    id?: string
    imageUrl?: string
    fullName?: string
    phone?: string
    /** `LocalDate` — "yyyy-MM-dd". */
    birthDate?: string
    role?: Role
}

/** `PUT /user/{id}` uchun. */
export interface UserUpdatePayload {
    fullName: string
    phone: string
    birthDate: string
}

/** `POST /auth/change-password` uchun. */
export interface ChangePasswordPayload {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

export interface StudentDto {
    id: string
    userDto?: UserDto
    parentPhone?: string
}

export interface TeacherDto {
    id: string
    userDto?: UserDto
}

/**
 * Guruh jadvali turi.
 *
 * Backend kunlar ro'yxatini emas, shu ikki qiymatdan birini saqlaydi:
 * toq kunlar (Du/Cho/Ju) yoki juft kunlar (Se/Pay/Sha).
 */
export const DAY_TYPES = ['ODD', 'EVEN'] as const
export type DayType = (typeof DAY_TYPES)[number]

export interface TimeTableDto {
    id?: string
    dayType?: DayType
    /** `LocalTime` — "HH:mm:ss". */
    startTime?: string
    endTime?: string
}

export const GROUP_STATUSES = ['STARTING', 'ONGOING', 'ENDED'] as const
export type GroupStatus = (typeof GROUP_STATUSES)[number]

export const GROUP_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const
export type GroupLevel = (typeof GROUP_LEVELS)[number]

export interface GroupDto {
    id: string
    name?: string
    room?: string
    teacher?: TeacherDto
    timeTable?: TimeTableDto
    status?: GroupStatus
    level?: GroupLevel
    /** Kurs boshlanganidan beri nechanchi oy. */
    currentMonth?: number
    /** Guruhda o'tilgan darslar soni. */
    lessonsCount?: number
}

/**
 * `GET /group/groups` (o'qituvchining guruhlari) javobi.
 *
 * Bu TO'LIQ `GroupDto` emas — backend `GroupNameProjection` qaytaradi,
 * ya'ni faqat `id` va `name`. `dayType` optional: proyeksiyaga qo'shilsa
 * o'qituvchi panelidagi toq/juft filtri o'zi ishlab ketadi.
 */
export interface GroupNameDto {
    id: string
    name?: string
    dayType?: DayType
}

/** `GET /group/groupInfo` javobi: guruh + uning ro'yxati. */
export interface FullGroupDto {
    groupDto?: GroupDto
    studentDto?: StudentDto[]
}

/** `LessonDto` — `lessonNumber` STRING (backend shunday qaytaradi). */
export interface LessonDto {
    id: string
    lessonNumber?: string
    /** `LocalDateTime` — "yyyy-MM-ddTHH:mm:ss". */
    lessonDate?: string
    isComplete?: boolean
    group?: GroupDto
    teacherDto?: TeacherDto
}

/**
 * Davomat statuslari.
 *
 * `LATE` ro'yxatda qoladi, chunki backend enum'ida bor va ESKI yozuvlarda
 * uchraydi — uni tipdan olib tashlasak, o'sha yozuvlar ko'rsatilmay qoladi.
 * Lekin yangi davomatda u TANLANMAYDI (pastga qarang): amalda deyarli
 * ishlatilmagan va o'qituvchini ortiqcha tanlovga majburlagan.
 */
export const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]

/** O'qituvchi yangi davomatda tanlay oladigan statuslar. */
export const SELECTABLE_ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'EXCUSED'] as const
export type SelectableAttendanceStatus = (typeof SELECTABLE_ATTENDANCE_STATUSES)[number]

export interface AttendanceStudentDto {
    studentId: string
    studentFullName?: string
    status: AttendanceStatus
}

export interface AttendanceDto {
    id?: string
    lessonId: string
    /** `LocalDateTime`; jadvaldagi ustun sanasi shundan olinadi. */
    createdAt?: string
    attendanceStudents?: AttendanceStudentDto[]
}

export const INVOICE_STATUSES = ['PAID', 'PENDING', 'OVERDUE'] as const
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number]

/**
 * `InvoiceDto` — to'lov hisobi.
 *
 * Diqqat: entity'da maydon `paymentStatus`, DTO'da esa `status`.
 * `amount` `BigDecimal` — JSON'da son bo'lib keladi, lekin tiyin/so'm
 * aniqligini yo'qotmaslik uchun biz uni HISOBLASHDA ishlatmaymiz, faqat
 * ko'rsatamiz.
 */
export interface InvoiceDto {
    id: string
    invoiceNumber?: string
    student?: StudentDto
    amount?: number
    /** `LocalDateTime` — "yyyy-MM-ddTHH:mm:ss". */
    issuedAt?: string
    status?: InvoiceStatus
}

/** Markaz sozlamalaridagi dam olish kunlari tanlagichi uchun (backendda yo'q). */
export const WEEK_DAYS = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
] as const
export type WeekDay = (typeof WEEK_DAYS)[number]
