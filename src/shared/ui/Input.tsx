import type { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import { inputClasses } from './inputClasses'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return <input className={cn(inputClasses, className)} {...props} />
}
