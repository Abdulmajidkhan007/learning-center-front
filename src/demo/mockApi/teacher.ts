import { db, fullGroup, json } from './state'

export function handleTeacher(path: string, url: URL): Response | null {
    if (path === '/group/groups') {
        return json(db.groups.filter((group) => group.status !== 'COMPLETED'))
    }
    if (path === '/group/groupInfo') {
        return json(fullGroup(url.searchParams.get('groupId') ?? 'g1'))
    }
    return null
}
