import type { ReactNode } from 'react'

export type DataTableAlign = 'left' | 'right'

export interface DataTableColumn<T> {
    key: string
    header: ReactNode
    render: (row: T) => ReactNode
    align?: DataTableAlign
    className?: string
}
