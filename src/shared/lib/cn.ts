/**
 * Shartli class nomlarini birlashtiradi.
 *
 * `clsx` o'rnatilmagan — bizga kerak bo'lgani shu 4 qator, qo'shimcha
 * bog'liqlikka arzimaydi.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
    return parts.filter(Boolean).join(' ')
}
