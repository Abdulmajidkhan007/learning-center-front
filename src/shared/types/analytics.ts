/** Analytics categories. */
export type AnalyticsCategory = 'student' | 'teacher' | 'lead' | 'invoice' | 'enrollment' | 'branch'

export interface StudentAnalyticsDto {
    studentCount?: number
    studentsAddedInMonth?: number
}

export interface TeacherAnalyticsDto {
    teacherCount?: number
    teachersAddedInMonth?: number
}

export interface LeadAnalyticsDto {
    leadCount?: number
    leadCountInAMonth?: number
}

export interface InvoiceAnalyticsDto {
    invoiceAmount?: number
    invoiceAmountInAMonth?: number
}

export interface EnrollmentAnalyticsDto {
    enrollmentCount?: number
    enrollmentCountInAMonth?: number
}

export interface BranchAnalyticsDto {
    branchCount?: number
}

export type AnalyticsStatDto =
    | StudentAnalyticsDto
    | TeacherAnalyticsDto
    | LeadAnalyticsDto
    | InvoiceAnalyticsDto
    | EnrollmentAnalyticsDto
    | BranchAnalyticsDto
