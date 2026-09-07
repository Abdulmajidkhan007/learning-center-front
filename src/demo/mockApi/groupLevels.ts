import type { GroupLevelDto } from '@/shared/types'
import { db, json, nextId, noContent } from './state'

export function handleGroupLevels(
    path: string,
    method: string,
    body: Record<string, unknown>
): Response | null {
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
    return null
}
