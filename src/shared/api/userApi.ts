import { apiFetch } from './httpClient'
import type { UserDto } from '../types'

/** Kirgan foydalanuvchining o'z ma'lumoti. */
export function fetchMe(token: string) {
    return apiFetch<UserDto>('/auth/me', { token })
}
