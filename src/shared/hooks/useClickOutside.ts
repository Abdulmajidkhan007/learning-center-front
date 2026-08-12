import { useEffect, type RefObject } from 'react'

/**
 * Element tashqarisiga bosilganda `onOutside` chaqiradi.
 *
 * `mousedown` ishlatiladi, `click` emas: menyu ichidagi tugma bosilganda
 * `click` allaqachon kech bo'ladi va menyu yopilib ulgurmaydi.
 */
export function useClickOutside(
    ref: RefObject<HTMLElement | null>,
    onOutside: () => void,
    enabled = true
): void {
    useEffect(() => {
        if (!enabled) return

        function handle(event: MouseEvent) {
            const el = ref.current
            if (el && event.target instanceof Node && !el.contains(event.target)) {
                onOutside()
            }
        }

        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [ref, onOutside, enabled])
}
