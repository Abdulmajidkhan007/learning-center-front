import {
    attendance,
    fullGroup,
    groupRoster,
    groups,
    invoices,
    lessons,
    students,
    teachers,
} from './mockData'
import type {
    AttendanceDto,
    GroupDto,
    InvoiceDto,
    InvoiceStatus,
    LessonDto,
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
}

/** Imzosiz, lekin to'g'ri tuzilgan JWT (ilova faqat payload'ni o'qiydi). */
function makeToken(role: string): string {
    const encode = (value: object) => {
        const bytes = new TextEncoder().encode(JSON.stringify(value))
        return btoa(String.fromCharCode(...bytes))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '')
    }
    return `${encode({ alg: 'none' })}.${encode({ role, sub: 'demo', name: 'Demo user' })}.demo`
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

/** `fetch` ni bir marta almashtiradi (qayta chaqirilsa hech narsa qilmaydi). */
export function installMockApi() {
    if (installed) return
    installed = true

    const original = window.fetch.bind(window)

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
        if (!raw.includes('/api/v1/')) return original(input as RequestInfo, init)

        const url = new URL(raw, window.location.origin)
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
        if (path === '/student/phone') {
            const phone = url.searchParams.get('phone') ?? ''
            return json(db.students.filter((student) => student.userDto?.phone === phone))
        }

        // --- o'qituvchi paneli ---
        if (path === '/group/groups') {
            return json(db.groups.filter((group) => group.status !== 'ENDED'))
        }
        if (path === '/group/groupInfo') {
            return json(fullGroup(url.searchParams.get('groupId') ?? 'g1'))
        }

        // --- davomat ---
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

        // --- generik CRUD: /student, /teacher, /group, /lesson ---
        const [, resource, tail] = path.split('/')
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
                    lessonNumber: String(db.lessons.length + 12),
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

        // Profil saqlash `PUT /user/{id}` orqali ketadi — demo'da shunchaki
        // yangi qiymatni qaytaramiz.
        if (resource === 'user' && method === 'PUT') {
            Object.assign(demoUser, body)
            return json(demoUser)
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
