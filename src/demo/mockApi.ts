import {
    attendance,
    branches,
    fullGroup,
    groupLevels,
    groupRoster,
    groups,
    invoices,
    leads,
    lessons,
    organizations,
    students,
    teachers,
} from './mockData'
import { ADMIN_PERMISSIONS } from '@/shared/types'
import type {
    AttendanceDto,
    BranchDto,
    GroupDto,
    GroupLevelDto,
    InvoiceDto,
    InvoiceStatus,
    LeadDto,
    LeadStatus,
    LessonDto,
    OrganizationDto,
    StudentDto,
    TeacherDto,
} from '@/shared/types'

/**
 * Demo uchun soxta backend.
 *
 * `window.fetch` ni butunlay almashtiradi, ya'ni ilova kodiga umuman
 * tegilmaydi — u o'zini haqiqiy serverga ulanganday tutadi. Ma'lumot
 * xotirada, sahifa yangilansa boshlang'ich holatga qaytadi.
 */

type Row = Record<string, unknown> & { id: string }

/** `GET /auth/me` javobi — demo foydalanuvchisi. */
const demoUser = {
    id: 'u-demo',
    // Sozlamalardagi markaz bloki shu filialni yuklaydi.
    branchId: 'b1',
    fullName: 'Demo Foydalanuvchi',
    phone: '+998 93 100 10 01',
    birthDate: '1995-06-15',
    imageUrl: undefined,
    role: 'ADMINISTRATOR',
}

const db = {
    students: [...students] as StudentDto[],
    teachers: [...teachers] as TeacherDto[],
    groups: [...groups] as GroupDto[],
    lessons: [...lessons] as LessonDto[],
    attendance: [...attendance] as AttendanceDto[],
    invoices: [...invoices] as InvoiceDto[],
    organizations: [...organizations] as OrganizationDto[],
    branches: [...branches] as BranchDto[],
    groupLevels: [...groupLevels] as GroupLevelDto[],
    leads: [...leads] as LeadDto[],
}

/**
 * Imzosiz, lekin to'g'ri tuzilgan JWT (ilova faqat payload'ni o'qiydi).
 *
 * `ADMINISTRATOR` uchun BARCHA ruxsatlar beriladi — demo cheklangan
 * administratorni emas, ilovaning to'liq imkoniyatini ko'rsatishi kerak.
 */
function makeToken(role: string): string {
    const encode = (value: object) => {
        const bytes = new TextEncoder().encode(JSON.stringify(value))
        return btoa(String.fromCharCode(...bytes))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
    }
    const permissions = role === 'ADMINISTRATOR' ? ADMIN_PERMISSIONS : undefined
    return `${encode({ alg: 'none' })}.${encode({ role, permissions, sub: 'demo', name: 'Demo user' })}.demo`
}

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    })
}

/**
 * Tanasiz javob (`DELETE` uchun).
 *
 * `new Response(body, { status: 204 })` — brauzer buni rad etadi:
 * "Response with null body status cannot have body". Backend ham
 * `noContent()` qaytaradi, ya'ni shakl ham to'g'ri bo'ladi.
 */
function noContent(): Response {
    return new Response(null, { status: 204 })
}

/** Spring Data `Page` ko'rinishida qaytaradi. */
function page<T extends Row>(rows: T[], url: URL) {
    const size = Number(url.searchParams.get('size') ?? 10)
    const index = Number(url.searchParams.get('page') ?? 0)
    const search = (url.searchParams.get('search') ?? '').toLowerCase()

    const filtered = search
        ? rows.filter((row) => JSON.stringify(row).toLowerCase().includes(search))
        : rows

    return json({
        content: filtered.slice(index * size, index * size + size),
        totalPages: Math.max(1, Math.ceil(filtered.length / size)),
        totalElements: filtered.length,
    })
}

function nextId(prefix: string) {
    return `${prefix}${Math.random().toString(36).slice(2, 8)}`
}

let installed = false

/** Joriy demo roli — `setDemoRole` orqali almashtiriladi. */
let currentRole = 'ADMINISTRATOR'

export function setDemoRole(role: string) {
    currentRole = role
}

/** Testing helper: allows reinstalling mock in test runners. */
export function resetMockApiInstalledFlag() {
    installed = false
}

/** `fetch` ni bir marta almashtiradi (qayta chaqirilsa hech narsa qilmaydi). */
export function installMockApi() {
    if (installed) return
    installed = true

    const fetchImpl = typeof window !== 'undefined' ? window.fetch : globalThis.fetch
    const original = fetchImpl.bind(typeof window !== 'undefined' ? window : globalThis)

    const mockFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
        if (!raw.includes('/api/v1/')) return original(input as RequestInfo, init)

        const origin =
            typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin !== 'null'
                ? window.location.origin
                : 'http://localhost'
        const url = new URL(raw, origin)
        const path = url.pathname.replace('/api/v1', '')
        const method = (init?.method ?? 'GET').toUpperCase()
        const body = init?.body ? (JSON.parse(String(init.body)) as Record<string, unknown>) : {}

        // Haqiqiy tarmoqqa o'xshasin — spinner'lar ko'rinib qolsin.
        await new Promise((resolve) => setTimeout(resolve, 180))

        // --- auth ---
        if (path === '/auth/refresh-token' || path === '/auth/login') {
            return json({ token: makeToken(currentRole), expiry: '2099-01-01T00:00:00Z' })
        }
        if (path === '/auth/me') {
            return json(demoUser)
        }
        if (path === '/auth/change-password') {
            // Demo'da har doim muvaffaqiyatli — haqiqiy tekshiruv backendda.
            return json({ response: 'Password changed successfully' })
        }

        // --- enrollments: o'quvchi ↔ guruh ko'prigi ---
        if (path === '/enrollments' && method === 'GET') {
            const groupId = url.searchParams.get('groupId') ?? ''
            const ids = groupRoster[groupId] ?? []
            return json({
                // Enrollment id si demo'da guruh+o'quvchidan yasaladi —
                // haqiqiy backendda u alohida yozuvning id si.
                content: ids.map((studentId) => ({ id: `e-${groupId}-${studentId}`, studentId, groupId })),
                totalPages: 1,
                totalElements: ids.length,
            })
        }
        if (path === '/enrollments' && method === 'POST') {
            const groupId = String(body.groupId)
            const studentId = String(body.studentId)
            groupRoster[groupId] = [...(groupRoster[groupId] ?? []), studentId]
            return json({ id: `e-${groupId}-${studentId}`, studentId, groupId })
        }
        if (path.startsWith('/enrollments/') && method === 'DELETE') {
            // `e-<groupId>-<studentId>` ni teskari yechamiz.
            const [, groupId, studentId] = path.split('/')[2].split('-')
            groupRoster[groupId] = (groupRoster[groupId] ?? []).filter((id) => id !== studentId)
            return noContent()
        }

        // --- o'quvchi paneli: o'z kartasini telefon bo'yicha topish ---
        // Guruh o'quvchilari — davomat jadvalining qatorlari.
        if (path.startsWith('/student/') && path.endsWith('/students') && method === 'GET') {
            const groupId = path.slice('/student/'.length, -'/students'.length)
            const ids = groupRoster[groupId] ?? []
            return json(db.students.filter((student) => ids.includes(student.id)))
        }
        if (path === '/student/phone') {
            const phone = url.searchParams.get('phone') ?? ''
            return json(db.students.filter((student) => student.userDto?.phone === phone))
        }

        // O'quvchi panelidagi guruh va davomat bloklari — demo'da kirgan
        // "o'quvchi" telefon raqami bo'yicha topiladi (haqiqiy backendda esa
        // token orqali).
        if (path === '/group/my' && method === 'GET') {
            const me = db.students.find((student) => student.userDto?.phone === demoUser.phone)
            const myGroupIds = Object.entries(groupRoster)
                .filter(([, ids]) => (me ? ids.includes(me.id) : false))
                .map(([groupId]) => groupId)
            // Backend `lessonsCount` ni bu endpoint uchun doim `null` qaytaradi —
            // demo ham shu xatti-harakatni takrorlaydi.
            return json(
                db.groups
                    .filter((group) => myGroupIds.includes(group.id))
                    .map((group) => ({ ...group, lessonsCount: null }))
            )
        }
        if (path.startsWith('/attendance/my/') && method === 'GET') {
            const me = db.students.find((student) => student.userDto?.phone === demoUser.phone)
            const groupId = path.slice('/attendance/my/'.length)
            const groupLessons = db.lessons.filter((lesson) => lesson.group?.id === groupId)
            const entries = groupLessons
                .map((lesson) => {
                    const record = db.attendance.find((item) => item.lessonId === lesson.id)
                    const mine = record?.attendanceStudents?.find((entry) => entry.studentId === me?.id)
                    if (!mine) return null
                    return {
                        title: lesson.topic ?? lesson.title ?? '',
                        date: lesson.lessonDate?.slice(0, 10) ?? '',
                        status: mine.status,
                        reason: mine.reason,
                    }
                })
                .filter((entry) => entry !== null)
            return json(entries)
        }

        // --- o'qituvchi paneli ---
        if (path === '/group/groups') {
            return json(db.groups.filter((group) => group.status !== 'COMPLETED'))
        }
        if (path === '/group/groupInfo') {
            return json(fullGroup(url.searchParams.get('groupId') ?? 'g1'))
        }

        // --- davomat ---
        /**
         * Guruhning oylik davomati.
         *
         * Demo'da oy bo'yicha filtrlash yo'q: mock ma'lumot bitta oyga tegishli,
         * shuning uchun `previousMonths` qabul qilinadi-yu, natijani
         * o'zgartirmaydi — ekranni ko'rsatish uchun shu yetarli.
         */
        if (path.startsWith('/attendance/monthly/') && method === 'GET') {
            const groupId = path.slice('/attendance/monthly/'.length)
            const groupLessons = db.lessons.filter((lesson) => lesson.group?.id === groupId)
            return json(
                groupLessons.map((lesson) => {
                    const record = db.attendance.find((item) => item.lessonId === lesson.id)
                    const attendanceStudentMap: Record<string, { status: string; reason?: string }> = {}
                    for (const entry of record?.attendanceStudents ?? []) {
                        if (entry.studentId && entry.status) {
                            attendanceStudentMap[entry.studentId] = { status: entry.status, reason: entry.reason }
                        }
                    }
                    return {
                        // `id` — davomat yozuvining o'zi (PUT shu yerga boradi), dars emas.
                        id: record?.id ?? lesson.id,
                        lessonTitle: lesson.topic ?? lesson.title ?? '',
                        date: lesson.lessonDate?.slice(0, 10) ?? '',
                        attendanceStudentMap,
                    }
                })
            )
        }
        if (path === '/attendance' && method === 'GET') return json(db.attendance)
        if (path === '/attendance' && method === 'POST') {
            const record: AttendanceDto = {
                id: nextId('a'),
                lessonId: String(body.lessonId),
                createdAt: new Date().toISOString(),
                attendanceStudents: body.students as AttendanceDto['attendanceStudents'],
            }
            db.attendance = [...db.attendance, record]
            return json(record)
        }
        if (path.startsWith('/attendance/') && method === 'PUT') {
            const id = path.slice('/attendance/'.length)
            const students = body.attendanceStudents as AttendanceDto['attendanceStudents']
            db.attendance = db.attendance.map((item) =>
                item.id === id ? { ...item, attendanceStudents: students } : item
            )
            const updated = db.attendance.find((item) => item.id === id)
            return updated ? json(updated) : json({ message: 'Attendance not found' }, 404)
        }

        // --- leads ---
        if (path === '/leads' && method === 'GET') {
            const status = url.searchParams.get('status')
            const rows = status
                ? db.leads.filter((lead) => lead.status === status)
                : db.leads
            return page(rows as unknown as Row[], url)
        }
        if (path === '/leads' && method === 'POST') {
            const level = db.groupLevels.find((item) => item.id === String(body.preferredCourse))
            const newLead: LeadDto = {
                id: nextId('ld'),
                fullName: String(body.fullName ?? ''),
                phone: String(body.phone ?? ''),
                status: 'NEW',
                source: body.source as LeadDto['source'],
                preferredCourse: level,
                createdAt: new Date().toISOString(),
            }
            db.leads = [newLead, ...db.leads]
            return json(newLead)
        }
        if (path.startsWith('/leads/') && method === 'PUT') {
            const id = path.slice('/leads/'.length)
            const level = body.preferredCourse
                ? db.groupLevels.find((item) => item.id === String(body.preferredCourse))
                : undefined
            db.leads = db.leads.map((lead) => {
                if (lead.id !== id) return lead
                return {
                    ...lead,
                    fullName: body.fullName !== undefined ? String(body.fullName) : lead.fullName,
                    phone: body.phone !== undefined ? String(body.phone) : lead.phone,
                    status: (body.status as LeadStatus) ?? lead.status,
                    source: body.source ? (body.source as LeadDto['source']) : lead.source,
                    preferredCourse: level ?? lead.preferredCourse,
                    callAt: body.callAt !== undefined ? String(body.callAt) : lead.callAt,
                    updatedAt: new Date().toISOString(),
                }
            })
            const updated = db.leads.find((lead) => lead.id === id)
            return updated ? json(updated) : json({ message: 'Lead not found' }, 404)
        }
        if (path.startsWith('/leads/') && path.endsWith('/enroll') && method === 'POST') {
            const id = path.slice('/leads/'.length, -'/enroll'.length)
            db.leads = db.leads.map((lead) => (lead.id === id ? { ...lead, status: 'ENROLLED' } : lead))
            const updated = db.leads.find((lead) => lead.id === id)
            return updated ? json(updated) : json({ message: 'Lead not found' }, 404)
        }
        if (path.startsWith('/leads/') && path.endsWith('/reject') && method === 'POST') {
            const id = path.slice('/leads/'.length, -'/reject'.length)
            db.leads = db.leads.map((lead) => (lead.id === id ? { ...lead, status: 'REJECTED' } : lead))
            const updated = db.leads.find((lead) => lead.id === id)
            return updated ? json(updated) : json({ message: 'Lead not found' }, 404)
        }
        if (path.startsWith('/leads/') && path.endsWith('/callLater') && method === 'PATCH') {
            const id = path.slice('/leads/'.length, -'/callLater'.length)
            const callAtParam = url.searchParams.get('callAt') ?? undefined
            db.leads = db.leads.map((lead) =>
                lead.id === id ? { ...lead, status: 'CALL_LATER', callAt: callAtParam } : lead
            )
            const updated = db.leads.find((lead) => lead.id === id)
            return updated ? json(updated) : json({ message: 'Lead not found' }, 404)
        }
        if (path.startsWith('/leads/') && method === 'DELETE') {
            const id = path.slice('/leads/'.length)
            db.leads = db.leads.filter((lead) => lead.id !== id)
            return noContent()
        }

        // --- group-level ---
        if (path === '/group-level/names' && method === 'GET') {
            return json(db.groupLevels.map((gl) => ({ id: gl.id, name: gl.name })))
        }
        if (path === '/group-level' && method === 'GET') {
            return json(db.groupLevels)
        }
        if (path === '/group-level' && method === 'POST') {
            const level: GroupLevelDto = {
                id: nextId('lvl'),
                name: String(body.name ?? ''),
                lessonCount: Number(body.lessonCount ?? 0),
                orderNumber: db.groupLevels.length + 1,
                durationInMonths: Number(body.durationInMonths ?? 0),
                monthlyFee: Number(body.monthlyFee ?? 0),
            }
            db.groupLevels = [...db.groupLevels, level]
            return json(level)
        }
        if (path === '/group-level' && method === 'PUT') {
            // Tartibni yangilash: { levels: [{ id, orderNumber }] }
            const levels = body.levels as Array<{ id: string; orderNumber: number }> | undefined
            if (Array.isArray(levels)) {
                const orderMap = new Map(levels.map((item) => [item.id, item.orderNumber]))
                db.groupLevels = db.groupLevels
                    .map((gl) => (orderMap.has(gl.id) ? { ...gl, orderNumber: orderMap.get(gl.id)! } : gl))
                    .sort((a, b) => a.orderNumber - b.orderNumber)
            }
            return json(db.groupLevels)
        }
        if (path.startsWith('/group-level/') && method === 'PUT') {
            const id = path.slice('/group-level/'.length)
            db.groupLevels = db.groupLevels.map((gl) => {
                if (gl.id !== id) return gl
                return {
                    ...gl,
                    ...(body.name !== undefined ? { name: String(body.name) } : {}),
                    ...(body.lessonCount !== undefined ? { lessonCount: Number(body.lessonCount) } : {}),
                    ...(body.durationInMonths !== undefined ? { durationInMonths: Number(body.durationInMonths) } : {}),
                    ...(body.monthlyFee !== undefined ? { monthlyFee: Number(body.monthlyFee) } : {}),
                }
            })
            const updated = db.groupLevels.find((gl) => gl.id === id)
            return updated ? json(updated) : json({ message: 'Group level not found' }, 404)
        }
        if (path.startsWith('/group-level/') && method === 'DELETE') {
            const id = path.slice('/group-level/'.length)
            db.groupLevels = db.groupLevels.filter((gl) => gl.id !== id)
            return noContent()
        }

        // --- analytics ---
        if (path.startsWith('/analytics/') && method === 'GET') {
            const category = path.slice('/analytics/'.length)
            switch (category) {
                case 'student':
                    return json({
                        studentCount: db.students.length,
                        studentsAddedInMonth: 3,
                    })
                case 'teacher':
                    return json({
                        teacherCount: db.teachers.length,
                        teachersAddedInMonth: 1,
                    })
                case 'lead':
                    return json({
                        leadCount: db.leads.length,
                        leadCountInAMonth: 5,
                    })
                case 'invoice': {
                    const totalAmount = db.invoices.reduce((sum, inv) => sum + (inv.amount ?? 0), 0)
                    return json({
                        invoiceAmount: totalAmount,
                        invoiceAmountInAMonth: 1050000,
                    })
                }
                case 'enrollment':
                    return json({
                        enrollmentCount: Object.values(groupRoster).reduce((sum, ids) => sum + ids.length, 0),
                        enrollmentCountInAMonth: 4,
                    })
                case 'branch':
                    return json({
                        branchCount: db.branches.length,
                    })
                default:
                    return json({ message: `Unknown analytics category: ${category}` }, 404)
            }
        }

        // --- super-admin: tashkilotlar va filiallar ---
        if (path === '/organizations' && method === 'GET') {
            return page(db.organizations as unknown as Row[], url)
        }
        if (path === '/organizations' && method === 'POST') {
            const org = { id: nextId('o'), ...body } as OrganizationDto
            db.organizations = [...db.organizations, org]
            return json(org)
        }
        if (path.startsWith('/organizations/') && method === 'PUT') {
            const id = path.split('/')[2]
            db.organizations = db.organizations.map((org) =>
                org.id === id ? { ...org, ...body } : org
            )
            return json(db.organizations.find((org) => org.id === id))
        }

        if (path === '/branch' && method === 'GET') {
            return page(db.branches as unknown as Row[], url)
        }
        if (path === '/branch' && method === 'POST') {
            // `organizationId` javobda qaytmaydi — backendda ham `BranchDto`
            // da tashkilot yo'q (izohga olingan).
            const branch = {
                id: nextId('b'),
                name: body.name,
                address: body.address,
                googleMapsUrl: body.googleMapsUrl,
                latitude: body.latitude,
                longitude: body.longitude,
                googlePlaceId: body.googlePlaceId,
            } as BranchDto
            db.branches = [...db.branches, branch]
            return json(branch)
        }
        if (path.startsWith('/branch/') && method === 'GET') {
            const id = path.slice('/branch/'.length)
            const branch = db.branches.find((item) => item.id === id)
            return branch ? json(branch) : json({ message: 'Branch not found' }, 404)
        }
        if (path.startsWith('/branch/') && method === 'PUT') {
            const id = path.split('/')[2]
            db.branches = db.branches.map((b) => (b.id === id ? { ...b, ...body } : b))
            return json(db.branches.find((b) => b.id === id))
        }
        if (path.startsWith('/branch/') && method === 'DELETE') {
            const id = path.split('/')[2]
            db.branches = db.branches.filter((b) => b.id !== id)
            return noContent()
        }

        // --- to'lovlar ---
        if (path === '/invoice' && method === 'GET') {
            const status = url.searchParams.get('status')
            const rows = status
                ? db.invoices.filter((invoice) => invoice.status === status)
                : db.invoices
            return page(rows as unknown as Row[], url)
        }
        if (path === '/invoice' && method === 'POST') {
            const student = db.students.find((item) => item.id === String(body.studentId))
            const invoice: InvoiceDto = {
                id: nextId('i'),
                invoiceNumber: `INV-${String(db.invoices.length + 1).padStart(3, '0')}`,
                student,
                amount: Number(body.amount),
                issuedAt: new Date().toISOString().slice(0, 19),
                // Backend ham shunday qiladi: yangi hisob doim kutilmoqda.
                status: 'PENDING',
            }
            db.invoices = [...db.invoices, invoice]
            return json(invoice)
        }
        if (path === '/invoice/return' && method === 'POST') {
            // Haqiqiy backend o'tilgan darslar pulini ushlab qoladi; demo'da
            // shunchaki oxirgi to'lovning yarmini qaytargan bo'lamiz.
            const studentId = url.searchParams.get('studentId') ?? ''
            const paid = db.invoices.find(
                (item) => item.student?.id === studentId && item.status === 'PAID'
            )
            const refundRecord: InvoiceDto = {
                id: nextId('i'),
                invoiceNumber: `RET-${String(db.invoices.length + 1).padStart(3, '0')}`,
                student: paid?.student,
                amount: Math.round((paid?.amount ?? 0) / 2),
                issuedAt: new Date().toISOString().slice(0, 19),
                status: 'PAID',
                type: 'RETURN',
            }
            db.invoices = [...db.invoices, refundRecord]
            return json(refundRecord)
        }
        if (path.startsWith('/invoice/') && method === 'PUT') {
            const id = path.split('/')[2]
            db.invoices = db.invoices.map((invoice) =>
                invoice.id === id ? { ...invoice, status: body.status as InvoiceStatus } : invoice
            )
            return json(db.invoices.find((invoice) => invoice.id === id))
        }
        if (path.startsWith('/invoice/') && method === 'DELETE') {
            const id = path.split('/')[2]
            db.invoices = db.invoices.filter((invoice) => invoice.id !== id)
            return noContent()
        }

        // Profil saqlash `PUT /user/{id}` orqali ketadi — demo'da shunchaki
        // yangi qiymatni qaytaramiz.
        const [, resource, tail] = path.split('/')
        if (resource === 'user' && method === 'PUT') {
            Object.assign(demoUser, body)
            return json(demoUser)
        }

        // --- generik CRUD: /student, /teacher, /group, /lesson ---
        const table = {
            student: 'students',
            teacher: 'teachers',
            group: 'groups',
            lesson: 'lessons',
        }[resource] as 'students' | 'teachers' | 'groups' | 'lessons' | undefined

        if (!table) return json({ message: `No mock for ${path}` }, 404)

        if (tail === 'count') return json(db[table].length)

        if (method === 'GET') {
            const rows = db[table] as unknown as Row[]
            const status = url.searchParams.get('status')
            const filtered =
                table === 'groups' && status ? rows.filter((row) => row.status === status) : rows
            return page(filtered, url)
        }

        if (method === 'POST') {
            // Dars boshlash: o'qituvchi paneli LessonDto kutadi.
            if (table === 'lessons') {
                const group = db.groups.find((item) => item.id === String(body.groupId))
                const lesson: LessonDto = {
                    id: nextId('l'),
                    title: String(db.lessons.length + 12),
                    lessonDate: new Date().toISOString().slice(0, 19),
                    isComplete: false,
                    group,
                    teacherDto: group?.teacher,
                }
                db.lessons = [...db.lessons, lesson]
                return json(lesson)
            }
            const created = { id: nextId(resource[0]), ...flatten(body) } as Row
            ;(db[table] as unknown as Row[]).push(created)
            return json(created)
        }

        if (method === 'PUT' && tail) {
            const rows = db[table] as unknown as Row[]
            const index = rows.findIndex((row) => row.id === tail)
            if (index >= 0) rows[index] = { ...rows[index], ...flatten(body), id: tail }
            return json(rows[index] ?? null)
        }

        if (method === 'DELETE' && tail) {
            db[table] = (db[table] as unknown as Row[]).filter(
                (row) => row.id !== tail
            ) as never
            return new Response('', { status: 204 })
        }

        return json({ message: `No mock for ${method} ${path}` }, 405)
    }

    if (typeof window !== 'undefined') window.fetch = mockFetch
    if (typeof globalThis !== 'undefined') globalThis.fetch = mockFetch
}

/**
 * Create/Update DTO'sini o'qish DTO'siga qaytaradi (backend shuni qiladi):
 * `{ user: {...} }` → `{ userDto: {...} }`, `teacherId` → to'liq o'qituvchi.
 */
function flatten(body: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = { ...body }

    const user = (body.userCreateDto ?? body.user) as Record<string, unknown> | undefined
    if (user) {
        result.userDto = user
        delete result.user
        delete result.userCreateDto
    }

    if (typeof body.teacherId === 'string') {
        result.teacher = db.teachers.find((teacher) => teacher.id === body.teacherId)
        delete result.teacherId
    }

    if (body.timeTable) result.timeTable = body.timeTable

    return result
}
