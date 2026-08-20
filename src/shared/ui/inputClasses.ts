import { cn } from '@/shared/lib'

/**
 * Barcha matn/vaqt/sana inputlari va select'lar uchun yagona ko'rinish.
 *
 * Alohida faylda turibdi, chunki komponent faylidan konstanta eksport
 * qilinsa Vite'ning Fast Refresh'i ishlamay qoladi.
 */
export const inputClasses = cn(
    'min-h-11 w-full rounded-lg border border-border-base bg-surface-card/85 px-3.5 text-sm text-fg shadow-[0_12px_28px_-26px_var(--fg)] backdrop-blur',
    'transition-[border-color,box-shadow] duration-150 placeholder:text-fg-faint',
    'hover:border-border-strong',
    'focus:border-accent focus:ring-3 focus:ring-accent/20 focus:outline-none'
)
