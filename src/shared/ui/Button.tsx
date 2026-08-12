import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib'

export type ButtonVariant = 'primary' | 'brand' | 'success' | 'purple' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md'

/**
 * Variantlar rang tokenlariga bog'langan, hex kodga emas — dark rejim
 * avtomatik ishlaydi.
 */
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: 'bg-fg text-fg-inverted hover:opacity-90',
    brand: 'bg-brand text-brand-fg font-semibold hover:opacity-90',
    success: 'bg-success text-white font-semibold hover:opacity-90',
    purple: 'bg-purple text-white hover:opacity-90',
    secondary: 'border border-border-base text-fg hover:border-border-strong hover:bg-surface-hover',
    ghost: 'text-fg-muted hover:bg-surface-hover',
    danger: 'bg-danger-soft text-danger-fg hover:bg-danger hover:text-white',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'px-3.5 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant
    size?: ButtonSize
    children: ReactNode
}

export function Button({
    variant = 'secondary',
    size = 'md',
    className,
    type = 'button',
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                'inline-flex cursor-pointer items-center justify-center gap-2 rounded-md whitespace-nowrap',
                'transition-[background-color,opacity,transform,border-color] duration-150 active:translate-y-px',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                'disabled:cursor-default disabled:opacity-55 disabled:active:translate-y-0',
                VARIANT_CLASSES[variant],
                SIZE_CLASSES[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}
