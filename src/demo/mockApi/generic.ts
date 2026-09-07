import type { LessonDto } from '@/shared/types'
import { db, demoUser, flatten, json, nextId, page, type Row } from './state'

export function handleGeneric(
    path: string,
    method: string,
    url: URL,
    body: Record<string, unknown>
): Response | null {
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
