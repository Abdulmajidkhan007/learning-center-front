import { handleSuperAdmin } from './superAdmin'

export function handleOrganizations(
    path: string,
    method: string,
    url: URL,
    body: Record<string, unknown>
): Response | null {
    return handleSuperAdmin(path, method, url, body)
}
