import { db, fullGroup, json } from './state'

export function handleTeacher(path: string, url: URL): Response | null {
    // O'qituvchi ko'rsatkichlari. Qizil va qora ro'yxat backendda ham
    // hozircha nol — demo ham xuddi shunday qaytaradi, aks holda demo
    // haqiqatdan ilgarilab ketadi.
    if (path === '/group/stats') {
        return json({
            totalStudents: 24,
            activeStudents: 22,
            newStudents: 3,
            lostStudents: 1,
            potentialFailStudents: 2,
            redList: 0,
            blackList: 0,
        })
    }

    if (path === '/group/groups') {
        return json(db.groups.filter((group) => group.status !== 'COMPLETED'))
    }
    if (path === '/group/groupInfo') {
        return json(fullGroup(url.searchParams.get('groupId') ?? 'g1'))
    }
    return null
}
