/** "Hech narsa yo'q" holati — jadval/ro'yxat bo'sh bo'lganda. */
export function EmptyState({ title, description }: { title: string; description?: string }) {
    return (
        <div className="rounded-lg border border-dashed border-border-base bg-surface-card px-6 py-8 text-center">
            <p className="font-display text-lg font-semibold text-fg">{title}</p>
            {description && <p className="mt-1.5 text-sm text-fg-muted">{description}</p>}
        </div>
    )
}
