import { Button } from './Button'

interface PaginationProps {
    page: number
    totalPages: number
    totalElements: number
    onPageChange: (page: number) => void
}

/** Sahifa raqami 0 dan boshlanadi (Spring Data shunday), ekranda +1 ko'rsatiladi. */
export function Pagination({ page, totalPages, totalElements, onPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-center gap-4">
            <Button size="sm" disabled={page <= 0} onClick={() => onPageChange(Math.max(0, page - 1))}>
                ← Prev
            </Button>
            <span className="font-mono text-xs text-fg-faint">
                Page {page + 1} of {Math.max(totalPages, 1)} · {totalElements} total
            </span>
            <Button size="sm" disabled={page + 1 >= totalPages} onClick={() => onPageChange(page + 1)}>
                Next →
            </Button>
        </div>
    )
}
