import { groupRoster } from '../mockData'
import { json, noContent } from './state'

export function handleEnrollments(
    path: string,
    method: string,
    url: URL,
    body: Record<string, unknown>
): Response | null {
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
    return null
}
