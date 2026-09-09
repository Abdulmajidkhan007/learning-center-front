import { groupRoster } from '../mockData'
import { db, demoUser, json } from './state'

export function handleStudents(
    path: string,
    method: string,
    url: URL
): Response | null {
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

    // Kirgan o'quvchining o'z yozuvi. Demo'da "kirgan o'quvchi" —
    // `demoUser` telefoni bilan mos keladigan yozuv. Balans va to'lov
    // holati guruhga bog'liq, shuning uchun `groupId` shart.
    if (path === '/student/me' && method === 'GET') {
        const me = db.students.find((student) => student.userDto?.phone === demoUser.phone)
        if (!me) return json({ message: 'Student not found' }, 404)
        // Balans butun o'quvchiga tegishli — guruh so'ralmaydi.
        return json({ ...me, balance: -300000 })
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

    return null
}
