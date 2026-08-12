import { cn, initials } from '@/shared/lib'

interface AvatarProps {
    name?: string
    src?: string
    size?: 'md' | 'lg'
}

const SIZE_CLASSES = { md: 'size-11 text-sm', lg: 'size-13 text-base' } as const

/** Rasm bo'lsa rasm, bo'lmasa bosh harflar — ro'yxat va modal uchun bir xil. */
export function Avatar({ name, src, size = 'md' }: AvatarProps) {
    const classes = cn('shrink-0 rounded-full', SIZE_CLASSES[size])

    if (src) {
        return <img src={src} alt="" className={cn(classes, 'object-cover ring-1 ring-border-base')} />
    }

    return (
        <div
            className={cn(
                classes,
                'flex items-center justify-center bg-brand font-display font-bold text-brand-fg ring-1 ring-border-base'
            )}
        >
            {initials(name)}
        </div>
    )
}
