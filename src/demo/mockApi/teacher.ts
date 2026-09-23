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
        // Backend `GroupNameProjection` qaytaradi: id, name va dayType.
        // Demo ham shu uchtasini bersin — ilgari `dayType` yo'q edi va
        // juft/toq filtri demoda umuman ko'rinmasdi.
        return json(
            db.groups
                .filter((group) => group.status !== 'COMPLETED')
                .map((group) => ({
                    id: group.id,
                    name: group.name,
                    dayType: group.timeTable?.dayType,
                }))
        )
    }
    if (path === '/group/groupInfo') {
        return json(fullGroup(url.searchParams.get('groupId') ?? 'g1'))
    }
    return null
}
