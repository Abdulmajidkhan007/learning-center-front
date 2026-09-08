import { handleCrud } from './crud'

export function handleGeneric(
    path: string,
    method: string,
    url: URL,
    body: Record<string, unknown>
): Response | null {
    return handleCrud(path, method, url, body)
}
