/**
 * Shapes the backend sends us, in one place.
 *
 * Why nearly every field is optional: these shapes were reverse-engineered
 * from the fetch calls in the pages (see the ASSUMPTION notes there), not
 * from confirmed Java DTOs. The compiler shouldn't promise a field is there
 * when nobody has verified it — the UI code already guards with `?.` and
 * `|| '—'`, and the types just tell the same truth.
 *
 * Once the real DTOs are confirmed, tighten THIS file only; the pages
 * shouldn't need to change.
 */

/** Spring Data `Page<T>` response. */
export interface Page<T> {
    content?: T[]
    totalPages?: number
    totalElements?: number
}

/**
 * Claims inside the JWT. `role` stays a plain string on purpose: a new role
 * added on the backend must not break the build here, it should just fall
 * through to the `default` branch of the dashboard router (App.tsx).
 */
export interface JwtClaims {
    role?: string
    [claim: string]: unknown
}

/** The signed-in user's session — lives in App.tsx state. */
export interface Session {
    token: string
    role: string
    claims: JwtClaims
}

/** Response of `POST /api/v1/auth/login` and `/auth/refresh-token`. */
export interface AuthResponse {
    token: string
    expiry?: string
    refreshToken?: string
    refreshExpiry?: string
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

export type WeekDay =
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY'

export interface TimeTableDto {
    days?: WeekDay[]
    /** `LocalTime`, serialized as "HH:mm:ss". */
    startTime?: string
    endTime?: string
}

export type GroupStatus = 'STARTING' | 'ONGOING' | 'ENDED'

export interface GroupDto {
    id: string
    name?: string
    room?: string
    teacher?: TeacherDto
    timeTable?: TimeTableDto
    status?: GroupStatus
}

/** Response of `GET /api/v1/group/groupInfo`. */
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

/** Attendance statuses — the list and the type come from one source. */
export const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]

export interface AttendanceStudentDto {
    studentId: string
    status: AttendanceStatus
}

export interface AttendanceDto {
    id?: string
    lessonId: string
    /** ISO datetime; the attendance table's column date comes from this. */
    createdAt?: string
    attendanceStudents?: AttendanceStudentDto[]
}
