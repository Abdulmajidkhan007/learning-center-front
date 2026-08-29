export const dataTableClasses = {
    container: 'mb-4 overflow-x-auto rounded-lg border border-border-base',
    table: 'w-full border-collapse text-sm',
    headerCell:
        'border-b border-border-base bg-surface px-4 py-2.5 text-left font-mono text-[0.66rem] tracking-[0.05em] whitespace-nowrap text-fg-faint uppercase',
    row: 'hover:bg-surface-hover',
    cell: 'border-b border-border-base px-4 py-3 whitespace-nowrap text-fg',
    stateCell: 'px-4 py-8 text-center text-fg-faint',
    actions: 'flex justify-end gap-2',
} as const
