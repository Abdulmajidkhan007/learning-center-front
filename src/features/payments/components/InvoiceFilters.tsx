import { useT } from '@/shared/i18n'
import { Button, Field, Input, Select } from '@/shared/ui'
import type { InvoiceStatus } from '@/shared/types'

interface InvoiceFiltersProps {
    search: string
    status: InvoiceStatus | ''
    from: string
    to: string
    statuses: readonly InvoiceStatus[]
    onSearchChange: (value: string) => void
    onStatusChange: (value: InvoiceStatus | '') => void
    onFromChange: (value: string) => void
    onToChange: (value: string) => void
    onClearDates: () => void
}

/**
 * Hisoblar ro'yxati filtri.
 *
 * Holat bo'yicha filtr saqlanib qoldi, garchi `InvoiceDto` da `status`
 * maydoni bo'lmasa ham: backend uni server tomonda tekshiradi, ya'ni
 * "faqat to'lanmaganlarini ko'rsat" ishlaydi — shunchaki ustun bo'lib
 * ko'rinmaydi.
 */
export function InvoiceFilters({
    search,
    status,
    from,
    to,
    statuses,
    onSearchChange,
    onStatusChange,
    onFromChange,
    onToChange,
    onClearDates,
}: InvoiceFiltersProps) {
    const { t } = useT()

    return (
        <div className="mb-4 flex flex-wrap items-end gap-2">
            <Field label={t('field.status')}>
                <Select
                    aria-label={t('admin.filterStatus')}
                    // `w-auto` EMAS: `inputClasses` ichida `w-full` bor va ikkalasi
                    // bir xil breakpoint'da bo'lgani uchun qaysi biri yutishi CSS
                    // tartibiga qolib ketadi. `sm:` esa aniq keyin keladi.
                    className="sm:w-44"
                    options={[
                        { value: '', label: t('invoice.allStatuses') },
                        ...statuses.map((value) => ({ value, label: t(`invoice.status.${value}`) })),
                    ]}
                    value={status}
                    onChange={(event) => onStatusChange(event.target.value as InvoiceStatus | '')}
                />
            </Field>

            <Field label={t('invoice.search')}>
                <Input
                    className="min-w-40 sm:w-56"
                    placeholder={t('invoice.search')}
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </Field>

            <Field label={t('invoice.from')}>
                <Input type="date" className="sm:w-44" value={from} onChange={(e) => onFromChange(e.target.value)} />
            </Field>

            <Field label={t('invoice.to')}>
                <Input type="date" className="sm:w-44" value={to} onChange={(e) => onToChange(e.target.value)} />
            </Field>

            {(from || to) && (
                <Button size="sm" onClick={onClearDates}>
                    {t('invoice.clearDates')}
                </Button>
            )}
        </div>
    )
}
