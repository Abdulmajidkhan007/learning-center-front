import { useT } from '@/shared/i18n'
import { Button } from './Button'

interface PaginationProps {
    page: number
    totalPages: number
    totalElements: number
    onPageChange: (page: number) => void
}

/** Sahifa raqami 0 dan boshlanadi (Spring Data shunday), ekranda +1 ko'rsatiladi. */
export function Pagination({ page, totalPages, totalElements, onPageChange }: PaginationProps) {
    const { t } = useT()

    return (
        <div className="mt-4 flex flex-nowrap items-center justify-between gap-2 sm:justify-center sm:gap-3">
            <Button size="sm" className="shrink-0" disabled={page <= 0} onClick={() => onPageChange(Math.max(0, page - 1))}>
                ← <span className="hidden sm:inline">{t('common.prev')}</span>
            </Button>
            <span className="truncate rounded-full bg-surface-muted px-3 py-1.5 font-mono text-xs tabular-nums text-fg-faint text-center">
                {t('common.pageInfo', {
                    page: page + 1,
                    total: Math.max(totalPages, 1),
                    count: totalElements,
                })}
            </span>
            <Button size="sm" className="shrink-0" disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
                <span className="hidden sm:inline">{t('common.next')}</span> →
            </Button>
        </div>
    )
}
