/**
 * `<input type="datetime-local">` beradigan "yyyy-MM-ddTHH:mm" ni backend
 * kutayotgan `LocalDateTime` ga aylantiradi — soniya qismi qo'shiladi.
 */
export function toLocalDateTime(value: string): string | undefined {
    return value ? `${value}:00` : undefined
}
