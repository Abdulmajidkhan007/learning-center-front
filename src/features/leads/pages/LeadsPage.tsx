import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { LEAD_STATUSES } from '@/shared/types'
import { AppShell, BackIcon, Button, ErrorBox, Eyebrow, IconButton, Input, Pagination, Panel, Select } from '@/shared/ui'
import { LeadTable } from '../components/LeadTable'
import { NewLeadModal } from '../components/NewLeadModal'
import { useLeadMutations } from '../hooks/useLeadMutations'
import { useLeads } from '../hooks/useLeads'
import type { LeadDto, LeadStatus } from '@/shared/types'

/** Lidlar bo'limi — potentsial o'quvchilar ro'yxati va holati. */
export function LeadsPage() {
    const { t } = useT()
    const session = useSession()
    const { signOut } = useAuth()
    const navigate = useNavigate()

    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<LeadStatus | ''>('')
    const [isModalOpen, setIsModalOpen] = useState(false)

    const list = useLeads(session.token, { page, search, status })

    /** Har qanday filtr o'zgarsa birinchi sahifaga qaytamiz. */
    function applyFilter(apply: () => void) {
        apply()
        setPage(0)
    }

    const { create, changeStatus, remove } = useLeadMutations(session.token)

    function handleStatusChange(lead: LeadDto, nextStatus: LeadStatus) {
        changeStatus.mutate({ id: lead.id, status: nextStatus })
    }

    function handleDelete(lead: LeadDto) {
        if (!confirm(t('lead.deleteConfirm', { name: lead.fullName ?? '' }))) return
        remove.mutate(lead.id)
    }

    const mutationError = changeStatus.error ?? remove.error

    return (
        <AppShell
            subtitle={t('lead.title')}
            onSignOut={signOut}
            actions={
                <>
                    <IconButton label={t('common.back')} onClick={() => navigate('/')}>
                        <BackIcon />
                    </IconButton>
                    <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                        {t('lead.new')}
                    </Button>
                </>
            }
        >
            <Panel>
                <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div className="min-w-0">
                        <Eyebrow>{t('lead.eyebrow')}</Eyebrow>
                        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">{t('lead.title')}</h1>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                        <Select
                            aria-label={t('admin.filterStatus')}
                            className="sm:w-44"
                            options={[
                                { value: '', label: t('lead.allStatuses') },
                                ...LEAD_STATUSES.map((value) => ({
                                    value,
                                    label: t(`lead.status.${value}`),
                                })),
                            ]}
                            value={status}
                            onChange={(event) =>
                                applyFilter(() => setStatus(event.target.value as LeadStatus | ''))
                            }
                        />
                        <Input
                            className="min-w-40 flex-1 sm:w-56 sm:flex-none"
                            placeholder={t('lead.search')}
                            value={search}
                            onChange={(event) => applyFilter(() => setSearch(event.target.value))}
                        />
                    </div>
                </header>

                {list.error && (
                    <div className="mb-4">
                        <ErrorBox>{t('lead.loadFailed', { message: errorMessage(list.error) })}</ErrorBox>
                    </div>
                )}

                {mutationError != null && (
                    <div className="mb-4">
                        <ErrorBox>{errorMessage(mutationError)}</ErrorBox>
                    </div>
                )}

                {!list.error && (
                    <LeadTable
                        leads={list.leads}
                        isLoading={list.isLoading}
                        pendingId={changeStatus.isPending ? changeStatus.variables?.id : undefined}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                    />
                )}

                <Pagination
                    page={page}
                    totalPages={list.totalPages}
                    totalElements={list.totalElements}
                    onPageChange={setPage}
                />
            </Panel>

            {isModalOpen && (
                <NewLeadModal
                    isSaving={create.isPending}
                    error={create.error}
                    onSubmit={(payload) => create.mutate(payload, { onSuccess: () => setIsModalOpen(false) })}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </AppShell>
    )
}
