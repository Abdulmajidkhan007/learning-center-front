import type { BranchDto, OrganizationDto } from '@/shared/types'
import { db, json, nextId, noContent, page, type Row } from './state'

export function handleSuperAdmin(
    path: string,
    method: string,
    url: URL,
    body: Record<string, unknown>
): Response | null {
    // Kirish oynasidagi tashkilot tanlagichi — bu yo'l token talab qilmaydi.
    if (path === '/organization/name' && method === 'GET') {
        return json(db.organizations.map((org) => ({ id: org.id, name: org.name })))
    }
    if (path === '/organization' && method === 'GET') {
        return page(db.organizations as unknown as Row[], url)
    }
    if (path === '/organization' && method === 'POST') {
        const org = { id: nextId('o'), ...body } as OrganizationDto
        db.organizations = [...db.organizations, org]
        return json(org)
    }
    if (path.startsWith('/organization/') && method === 'PUT') {
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

    return null
}
