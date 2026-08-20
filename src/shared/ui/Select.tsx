import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import { inputClasses } from './inputClasses'

export interface SelectOption {
    value: string
    label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: SelectOption[]
    /** Bo'sh variant matni; berilmasa bo'sh variant ko'rsatilmaydi. */
    placeholder?: string
}

export function Select({ options, placeholder, className, ...props }: SelectProps) {
    return (
        <select className={cn(inputClasses, 'cursor-pointer appearance-auto accent-accent', className)} {...props}>
            {placeholder !== undefined && <option value="">{placeholder}</option>}
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}
