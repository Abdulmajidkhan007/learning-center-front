/**
 * Backenddan keladigan DTO shakllari — bitta joyda.
 *
 * Nega deyarli hamma maydon optional (`?`): bu shakllar `fetch` chaqiruvlaridan
 * teskari qayta tiklangan, real Java DTO'lari hali tasdiqlanmagan. Kompilyator
 * "bu maydon bor" deb yolg'on kafolat bermasligi kerak.
 *
 * DTO'lar tasdiqlangach FAQAT shu fayl qattiqlashtiriladi — qaysi sahifa
 * noto'g'ri taxmin qilgan bo'lsa, kompilyator o'zi ko'rsatib beradi.
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

/** `POST /auth/login` va `/auth/refresh-token` javobi. */
export interface AuthResponse {
    token: string
    expiry?: string
    refreshToken?: string
    refreshExpiry?: string
}

export interface LoginCredentials {
    phone: string
    password: string
    rememberMe: boolean
}

export interface UserDto {
    id?: string
    fullName?: string
    phone?: string
    birthDate?: string
    imgUrl?: string
    role?: string
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

export interface TimeTableDto {
    days?: WeekDay[]
    /** `LocalTime`, "HH:mm:ss" ko'rinishida keladi. */
    startTime?: string
    endTime?: string
}

export const GROUP_STATUSES = ['STARTING', 'ONGOING', 'ENDED'] as const
export type GroupStatus = (typeof GROUP_STATUSES)[number]

export interface GroupDto {
    id: string
    name?: string
    room?: string
    teacher?: TeacherDto
    timeTable?: TimeTableDto
    status?: GroupStatus
}

/** `GET /group/groupInfo` javobi: guruh + uning ro'yxati. */
export interface FullGroupDto {
    groupDto?: GroupDto
    studentDto?: StudentDto[]
}

export interface LessonDto {
    id: string
    lessonNumber?: number
    /** `LocalDate` — "yyyy-MM-dd". */
    lessonDate?: string
    lessonName?: string
}

/** Davomat statuslari — ro'yxat va tip bitta manbadan chiqadi. */
export const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]

export interface AttendanceStudentDto {
    studentId: string
    status: AttendanceStatus
}

export interface AttendanceDto {
    id?: string
    lessonId: string
    /** ISO datetime; jadvaldagi ustun sanasi shundan olinadi. */
    createdAt?: string
    attendanceStudents?: AttendanceStudentDto[]
}
