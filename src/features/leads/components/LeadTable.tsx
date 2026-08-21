import { useT } from '@/shared/i18n'
import { formatDate, formatTime } from '@/shared/lib'
import { IconButton, Select, TrashIcon } from '@/shared/ui'
import { LEAD_STATUSES } from '@/shared/types'
import { LeadStatusBadge } from './LeadStatusBadge'
import type { LeadDto, LeadStatus } from '@/shared/types'

interface LeadTableProps {
    leads: LeadDto[]
    isLoading: boolean
    /** Holati o'zgartirilayotgan lid — tanlagich shu qatorda o'chiriladi. */
    pendingId?: string
    onStatusChange: (lead: LeadDto, status: LeadStatus) => void
    onDelete: (lead: LeadDto) => void
}

export function LeadTable({ leads, isLoading, pendingId, onStatusChange, onDelete }: LeadTableProps) {
    const { t } = useT()

    return (
        <div className="mb-4 overflow-x-auto rounded-lg border border-border-base">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr>
                        {[
                            t('lead.fullName'),
                            t('lead.phone'),
                            t('lead.callAt'),
                            t('lead.source'),
                            t('lead.preferredCourse'),
                            t('field.status'),
                        ].map((label) => (
                            <th
                                key={label}
                                className="border-b border-border-base bg-surface px-4 py-2.5 text-left font-mono text-[0.66rem] tracking-[0.05em] whitespace-nowrap text-fg-faint uppercase"
                            >
                                {label}
                            </th>
                        ))}
                        <th className="border-b border-border-base bg-surface px-4 py-2.5 text-right font-mono text-[0.66rem] tracking-[0.05em] whitespace-nowrap text-fg-faint uppercase">
                            {t('admin.actions')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-fg-faint">
                                {t('common.loading')}
                            </td>
                        </tr>
                    )}

                    {!isLoading && leads.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-fg-faint">
                                {t('lead.empty')}
                            </td>
                        </tr>
                    )}

                    {!isLoading &&
                        leads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-surface-hover">
                                <td className="border-b border-border-base px-4 py-3 whitespace-nowrap text-fg">
                                    {lead.fullName ?? '—'}
                                </td>
                                <td className="border-b border-border-base px-4 py-3 font-mono text-xs whitespace-nowrap text-fg-muted">
                                    {lead.phone ?? '—'}
                                </td>
                                <td className="border-b border-border-base px-4 py-3 tabular-nums whitespace-nowrap text-fg-muted">
                                    {lead.callAt ? `${formatDate(lead.callAt)} ${formatTime(lead.callAt)}` : '—'}
                                </td>
                                {/* Manba serverdan kelgan enum nomi bilan ko'rsatiladi —
                                    qiymatlari (INSTAGRAM/FACEBOOK/TELEGRAM) o'zi tushunarli. */}
                                <td className="border-b border-border-base px-4 py-3 font-mono text-xs whitespace-nowrap text-fg-muted">
                                    {lead.source ? t(`lead.source.${lead.source}`) : '—'}
                                </td>
                                <td className="border-b border-border-base px-4 py-3 whitespace-nowrap text-fg-muted">
                                    {lead.preferredCourse ?? '—'}
                                </td>
                                <td className="border-b border-border-base px-4 py-3 whitespace-nowrap">
                                    <LeadStatusBadge status={lead.status} />
                                </td>
                                <td className="border-b border-border-base px-4 py-3 text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-2">
                                        <Select
                                            aria-label={t('lead.changeStatus')}
                                            className="w-auto"
                                            disabled={pendingId === lead.id}
                                            options={LEAD_STATUSES.map((status) => ({
                                                value: status,
                                                label: t(`lead.status.${status}`),
                                            }))}
                                            value={lead.status ?? ''}
                                            onChange={(event) =>
                                                onStatusChange(lead, event.target.value as LeadStatus)
                                            }
                                        />
                                        <IconButton
                                            label={t('common.delete')}
                                            tone="danger"
                                            onClick={() => onDelete(lead)}
                                        >
                                            <TrashIcon />
                                        </IconButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
