/** "Hech narsa yo'q" holati — jadval/ro'yxat bo'sh bo'lganda. */
export function EmptyState({ title, description }: { title: string; description?: string }) {
    return (
        <div className="rounded-xl border border-dashed border-border-base bg-surface-card/75 px-6 py-10 text-center shadow-[0_22px_60px_-42px_var(--fg)] backdrop-blur-xl">
            <p className="font-display text-lg font-semibold text-fg">{title}</p>
            {description && <p className="mt-1.5 text-sm text-fg-muted">{description}</p>}
        </div>
    )
}
