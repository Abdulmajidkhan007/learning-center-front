import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import type { LeadCreateDto, LeadDto, LeadRejectDto, LeadSource, LeadStatus, LeadUpdateDto } from '@/shared/types'
import { LEAD_SOURCES, LEAD_STATUSES, REJECTION_REASONS } from '@/shared/types'
import { useT } from '@/shared/i18n'
import { AppShell, Badge, Button, EmptyState, ErrorBox, Field, Input, Modal, Panel, Select } from '@/shared/ui'
import { useLeadCourseOptions, useLeadGroupOptions, useLeadMutations, useLeads } from '../hooks/useLeads'

const PAGE_SIZE = 50
const EMPTY_LEADS: LeadDto[] = []
const PHONE_RE = /^\+?[1-9]\d{1,14}$/
const STATUS_TONE: Record<LeadStatus, 'accent' | 'success' | 'warning' | 'danger'> = { NEW: 'accent', ENROLLED: 'success', CALL_LATER: 'warning', REJECTED: 'danger' }
const COLUMN_TONE: Record<LeadStatus, string> = { NEW: 'border-accent/30 bg-accent-soft', ENROLLED: 'border-success/30 bg-success-soft', CALL_LATER: 'border-warning/30 bg-warning-soft', REJECTED: 'border-danger/30 bg-danger-soft' }

type FormState = { fullName: string; phone: string; source: LeadSource | ''; preferredCourse: string }
const emptyForm: FormState = { fullName: '', phone: '', source: '', preferredCourse: '' }

function formatDate(value?: string | null) {
    if (!value) return null
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function asStatus(value?: LeadStatus): LeadStatus { return LEAD_STATUSES.includes(value as LeadStatus) ? value as LeadStatus : 'NEW' }

export function LeadsPage() {
    const { token } = useSession()
    const { signOut } = useAuth()
    const navigate = useNavigate()
    const { t } = useT()
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<LeadStatus | ''>('')
    const [editing, setEditing] = useState<LeadDto | null>(null)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [draggedId, setDraggedId] = useState<string | null>(null)
    const [action, setAction] = useState<{ lead: LeadDto; status: LeadStatus } | null>(null)
    const [groupId, setGroupId] = useState('')
    const [rejectReason, setRejectReason] = useState<LeadRejectDto['reason']>('OTHER')
    const [rejectNote, setRejectNote] = useState('')
    const [callAt, setCallAt] = useState('')
    const newLeads = useLeads(token, { size: PAGE_SIZE, search: search || undefined, status: 'NEW' })
    const enrolledLeads = useLeads(token, { size: PAGE_SIZE, search: search || undefined, status: 'ENROLLED' })
    const callLaterLeads = useLeads(token, { size: PAGE_SIZE, search: search || undefined, status: 'CALL_LATER' })
    const rejectedLeads = useLeads(token, { size: PAGE_SIZE, search: search || undefined, status: 'REJECTED' })
    const lists = useMemo(
        () => ({ NEW: newLeads, ENROLLED: enrolledLeads, CALL_LATER: callLaterLeads, REJECTED: rejectedLeads }),
        [newLeads, enrolledLeads, callLaterLeads, rejectedLeads]
    )
    const loadMoreRefs = useRef<Partial<Record<LeadStatus, HTMLDivElement>>>({})
    const listsRef = useRef(lists)
    useEffect(() => {
        listsRef.current = lists
    }, [lists])
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const status = entry.target.getAttribute('data-status') as LeadStatus
                const list = listsRef.current[status]
                if (entry.isIntersecting && list.hasNextPage && !list.isFetchingNextPage) void list.fetchNextPage()
            })
        }, { rootMargin: '160px' })

        Object.values(loadMoreRefs.current).forEach((element) => observer.observe(element))
        return () => observer.disconnect()
    }, [lists.CALL_LATER.hasNextPage, lists.ENROLLED.hasNextPage, lists.NEW.hasNextPage, lists.REJECTED.hasNextPage])
    const leadsByStatus = Object.fromEntries(LEAD_STATUSES.map((status) => [status, lists[status].data?.pages.flatMap((page) => page?.content ?? []) ?? EMPTY_LEADS])) as Record<LeadStatus, LeadDto[]>
    const visibleStatuses: LeadStatus[] = filter ? [filter] : [...LEAD_STATUSES]
    const leads = visibleStatuses.flatMap((status) => leadsByStatus[status])
    const mutations = useLeadMutations(token)
    const groups = useLeadGroupOptions(token)
    const courseOptions = useLeadCourseOptions(token)
    const total = leads.length
    const apiError = LEAD_STATUSES.map((status) => lists[status].error).find(Boolean) ?? mutations.create.error ?? mutations.update.error ?? mutations.enroll.error ?? mutations.reject.error ?? mutations.callLater.error ?? mutations.remove.error

    function openCreate() { setEditing(null); setForm(emptyForm); setIsFormOpen(true) }
    function openEdit(lead: LeadDto) {
        setEditing(lead)
        setForm({ fullName: lead.fullName ?? '', phone: lead.phone ?? '', source: lead.source ?? '', preferredCourse: lead.preferredCourse?.id ?? '' })
        setIsFormOpen(true)
    }
    function closeModal() { setEditing(null); setForm(emptyForm); setIsFormOpen(false) }
    function save() {
        const body: LeadCreateDto = { fullName: form.fullName.trim(), phone: form.phone.trim(), source: form.source || undefined, preferredCourse: form.preferredCourse.trim() || undefined }
        if (!body.fullName || !PHONE_RE.test(body.phone)) return
        if (editing) mutations.update.mutate({ id: editing.id, body: { ...body, status: asStatus(editing.status) } as LeadUpdateDto }, { onSuccess: closeModal })
        else mutations.create.mutate(body, { onSuccess: closeModal })
    }
    function changeStatus(lead: LeadDto, status: LeadStatus) {
        if (asStatus(lead.status) === status || status === 'NEW') return
        setAction({ lead, status })
        setGroupId('')
        setRejectReason('OTHER')
        setRejectNote('')
        setCallAt('')
    }
    function drop(status: LeadStatus) {
        const lead = leads.find((item) => item.id === draggedId)
        setDraggedId(null)
        if (lead) changeStatus(lead, status)
    }
    function submitAction() {
        if (!action) return
        if (action.status === 'ENROLLED' && groupId) mutations.enroll.mutate({ id: action.lead.id, groupId }, { onSuccess: () => setAction(null) })
        if (action.status === 'REJECTED') mutations.reject.mutate({ id: action.lead.id, body: { reason: rejectReason, note: rejectNote.trim() || undefined } }, { onSuccess: () => setAction(null) })
        if (action.status === 'CALL_LATER' && callAt) mutations.callLater.mutate({ id: action.lead.id, callAt }, { onSuccess: () => setAction(null) })
    }

    return (
        <AppShell subtitle={t('lead.title')} onSignOut={signOut} actions={<><Button size="sm" onClick={() => navigate('/')}>{t('common.back')}</Button><Button variant="primary" size="sm" onClick={openCreate}>{t('lead.new')}</Button></>}>
            <div className="mx-auto max-w-[1600px] space-y-5">
                <Panel className="border-0 bg-linear-to-br from-accent-soft/60 via-surface-card to-surface-card p-5 sm:p-7">
                    <div className="flex flex-wrap items-end justify-between gap-4"><div><Badge tone="accent">{t('lead.eyebrow')}</Badge><h1 className="mt-3 font-display text-3xl font-semibold text-fg">{t('lead.title')}</h1><p className="mt-1 text-sm text-fg-muted">{t('lead.description')}</p></div><div className="rounded-xl border border-border-base bg-surface-card px-4 py-3 text-right"><p className="text-xs text-fg-muted">{t('lead.total')}</p><p className="font-display text-2xl font-semibold text-fg">{total}</p></div></div>
                    <div className="mt-6 flex flex-col gap-2 md:flex-row"><Input aria-label={t('lead.search')} placeholder={t('lead.search')} value={search} onChange={(event) => setSearch(event.target.value)} /><Select aria-label={t('lead.allStatuses')} className="md:w-52" placeholder={t('lead.allStatuses')} value={filter} options={LEAD_STATUSES.map((status) => ({ value: status, label: t(`lead.status.${status}`) }))} onChange={(event) => setFilter(event.target.value as LeadStatus | '')} /></div>
                </Panel>
                {apiError && <ErrorBox>{t('lead.loadFailed', { message: errorMessage(apiError, t('common.somethingWrong')) })}</ErrorBox>}
                <div className="overflow-x-auto pb-2"><div className="grid min-w-[1040px] grid-cols-4 gap-4">
                    {visibleStatuses.map((status) => { const list = lists[status]; const grouped = leadsByStatus[status]; return <section key={status} className={`flex min-h-110 flex-col rounded-2xl border p-3 ${COLUMN_TONE[status]}`} onDragOver={(event) => event.preventDefault()} onDrop={() => drop(status)}>
                        <header className="mb-3 flex items-center justify-between px-1"><div><h2 className="font-display text-base font-semibold text-fg">{t(`lead.status.${status}`)}</h2><p className="text-xs text-fg-muted">{t('lead.count', { count: grouped.length })}</p></div><Badge tone={STATUS_TONE[status]}>{grouped.length}</Badge></header>
                        <div className="flex flex-1 flex-col gap-3">{list.isLoading ? <div className="rounded-xl border border-dashed border-border-base bg-surface-card p-5 text-center text-sm text-fg-muted">{t('common.loading')}</div> : grouped.length === 0 ? <div className="flex min-h-32 flex-1 items-center justify-center rounded-xl border border-dashed border-border-base bg-surface-card/60 px-4 text-center text-xs text-fg-muted">{t('lead.dropHere')}</div> : grouped.map((lead) => <article key={lead.id} draggable onDragStart={() => setDraggedId(lead.id)} onDragEnd={() => setDraggedId(null)} className="cursor-grab rounded-xl border border-border-base bg-surface-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="truncate font-semibold text-fg">{lead.fullName || t('lead.unnamed')}</h3><a className="mt-1 block text-sm text-accent-fg hover:underline" href={`tel:${lead.phone ?? ''}`}>{lead.phone || t('lead.noPhone')}</a></div><Button size="sm" onClick={() => openEdit(lead)}>{t('common.edit')}</Button></div><div className="mt-3 flex flex-wrap gap-1.5">{lead.source && <Badge tone="slate">{t(`lead.source.${lead.source}`)}</Badge>}{lead.preferredCourse?.name && <Badge tone="purple">{lead.preferredCourse.name}</Badge>}</div>{lead.callAt && <p className="mt-3 rounded-lg bg-warning-soft px-2.5 py-2 text-xs font-medium text-warning-fg">{t('lead.callAt')}: {formatDate(lead.callAt)}</p>}<div className="mt-3 flex items-center gap-2 border-t border-border-base pt-3"><Select aria-label={t('lead.changeStatus')} className="text-xs" value={status} options={LEAD_STATUSES.map((value) => ({ value, label: t(`lead.status.${value}`) }))} onChange={(event) => changeStatus(lead, event.target.value as LeadStatus)} /><button type="button" className="ml-auto text-xs font-medium text-danger-fg hover:underline" onClick={() => { if (confirm(t('lead.deleteConfirm', { name: lead.fullName || t('lead.unnamed') }))) mutations.remove.mutate(lead.id) }}>{t('common.delete')}</button></div></article>)}{list.hasNextPage && <div ref={(element) => { if (element) loadMoreRefs.current[status] = element; else delete loadMoreRefs.current[status] }} data-status={status} className="h-8 text-center text-xs text-fg-muted">{list.isFetchingNextPage ? t('common.loading') : ''}</div>}</div>
                    </section> })}
                </div></div>
                {visibleStatuses.every((status) => !lists[status].isLoading) && leads.length === 0 && !apiError && <EmptyState title="No leads found" description="Try a different search, or add your first lead." />}
            </div>
            {isFormOpen && <Modal eyebrow={editing ? 'EDIT LEAD' : 'NEW LEAD'} title={editing ? `${t('common.edit')} lead` : t('lead.newTitle')} onClose={closeModal} footer={<><Button onClick={closeModal}>{t('common.cancel')}</Button><Button variant="primary" onClick={save} disabled={!form.fullName.trim() || !PHONE_RE.test(form.phone.trim()) || mutations.create.isPending || mutations.update.isPending}>{t('common.save')}</Button></>}><div className="space-y-4"><Field label="Full name"><Input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required /></Field><Field label="Phone"><Input type="tel" placeholder="+998901234567" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required /><p className="mt-1 text-xs text-fg-muted">International format, e.g. +998901234567</p></Field><Field label="Source"><Select placeholder="Select source" value={form.source} options={LEAD_SOURCES.map((source) => ({ value: source, label: source }))} onChange={(event) => setForm({ ...form, source: event.target.value as LeadSource | '' })} /></Field><Field label="Preferred course"><Select placeholder="Select level" value={form.preferredCourse} options={courseOptions.data ?? []} onChange={(event) => setForm({ ...form, preferredCourse: event.target.value })} /></Field></div></Modal>}
            {action && <Modal eyebrow={t('lead.actionEyebrow')} title={action.status === 'ENROLLED' ? t('lead.action.ENROLLED') : action.status === 'REJECTED' ? t('lead.action.REJECTED') : t('lead.action.CALL_LATER')} onClose={() => setAction(null)} footer={<><Button onClick={() => setAction(null)}>{t('common.cancel')}</Button><Button variant="primary" onClick={submitAction} disabled={(action.status === 'ENROLLED' && !groupId) || (action.status === 'CALL_LATER' && !callAt) || mutations.enroll.isPending || mutations.reject.isPending || mutations.callLater.isPending}>{t('common.save')}</Button></>}>
                {action.status === 'ENROLLED' && <Field label={t('lead.group')}><Select aria-label={t('lead.group')} placeholder={t('lead.selectGroup')} value={groupId} options={groups.data ?? []} onChange={(event) => setGroupId(event.target.value)} /></Field>}
                {action.status === 'REJECTED' && <div className="space-y-4"><Field label={t('lead.rejectionReason')}><Select aria-label={t('lead.rejectionReason')} options={REJECTION_REASONS.map((reason) => ({ value: reason, label: t(`lead.reason.${reason}`) }))} value={rejectReason} onChange={(event) => setRejectReason(event.target.value as LeadRejectDto['reason'])} /></Field><Field label={t('lead.note')}><Input value={rejectNote} onChange={(event) => setRejectNote(event.target.value)} /></Field></div>}
                {action.status === 'CALL_LATER' && <Field label={t('lead.callAt')}><Input type="datetime-local" value={callAt} onChange={(event) => setCallAt(event.target.value)} min={new Date().toISOString().slice(0, 16)} /></Field>}
            </Modal>}
        </AppShell>
    )
}
