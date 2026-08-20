import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import type { LeadCreateDto, LeadDto, LeadSource, LeadStatus } from '@/shared/types'
import { LEAD_SOURCES, LEAD_STATUSES } from '@/shared/types'
import { AppShell, Badge, Button, EmptyState, ErrorBox, Field, Input, Modal, Panel, Select } from '@/shared/ui'
import { useLeadMutations, useLeads } from '../hooks/useLeads'

const PAGE_SIZE = 50
const EMPTY_LEADS: LeadDto[] = []
const PHONE_RE = /^\+?[1-9]\d{1,14}$/
const STATUS_LABEL: Record<LeadStatus, string> = { NEW: 'New', CONFIRMED: 'Will Study', CALL_LATER: 'Call Later', REJECTED: 'Rejected' }
const STATUS_TONE: Record<LeadStatus, 'accent' | 'success' | 'warning' | 'danger'> = { NEW: 'accent', CONFIRMED: 'success', CALL_LATER: 'warning', REJECTED: 'danger' }
const COLUMN_TONE: Record<LeadStatus, string> = { NEW: 'border-sky-200 bg-sky-50/50', CONFIRMED: 'border-emerald-200 bg-emerald-50/50', CALL_LATER: 'border-amber-200 bg-amber-50/50', REJECTED: 'border-rose-200 bg-rose-50/50' }

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
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState<LeadStatus | ''>('')
    const [editing, setEditing] = useState<LeadDto | null>(null)
    const [form, setForm] = useState<FormState>(emptyForm)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [draggedId, setDraggedId] = useState<string | null>(null)
    const list = useLeads(token, { page, size: PAGE_SIZE, search: search || undefined, status: filter || undefined })
    const mutations = useLeadMutations(token)
    const leads = list.data?.content ?? EMPTY_LEADS
    const grouped = useMemo(() => LEAD_STATUSES.reduce((result, status) => ({ ...result, [status]: leads.filter((lead) => asStatus(lead.status) === status) }), {} as Record<LeadStatus, LeadDto[]>), [leads])
    const total = list.data?.totalElements ?? leads.length
    const apiError = list.error ?? mutations.create.error ?? mutations.update.error ?? mutations.status.error ?? mutations.remove.error

    function openCreate() { setEditing(null); setForm(emptyForm); setIsFormOpen(true) }
    function openEdit(lead: LeadDto) {
        setEditing(lead)
        setForm({ fullName: lead.fullName ?? '', phone: lead.phone ?? '', source: lead.source ?? '', preferredCourse: lead.preferredCourse ?? '' })
        setIsFormOpen(true)
    }
    function closeModal() { setEditing(null); setForm(emptyForm); setIsFormOpen(false) }
    function save() {
        const body: LeadCreateDto = { fullName: form.fullName.trim(), phone: form.phone.trim(), source: form.source || undefined, preferredCourse: form.preferredCourse.trim() || undefined }
        if (!body.fullName || !PHONE_RE.test(body.phone)) return
        if (editing) mutations.update.mutate({ id: editing.id, body }, { onSuccess: closeModal })
        else mutations.create.mutate(body, { onSuccess: closeModal })
    }
    function changeStatus(lead: LeadDto, status: LeadStatus) { if (asStatus(lead.status) !== status) mutations.status.mutate({ id: lead.id, status }) }
    function drop(status: LeadStatus) {
        const lead = leads.find((item) => item.id === draggedId)
        setDraggedId(null)
        if (lead) changeStatus(lead, status)
    }

    return (
        <AppShell subtitle="Leads" onSignOut={signOut} actions={<><Button size="sm" onClick={() => navigate('/')}>Back</Button><Button variant="primary" size="sm" onClick={openCreate}>+ Add lead</Button></>}>
            <div className="mx-auto max-w-[1600px] space-y-5">
                <Panel className="border-0 bg-linear-to-br from-accent-soft/60 via-surface-card to-surface-card p-5 sm:p-7">
                    <div className="flex flex-wrap items-end justify-between gap-4"><div><Badge tone="accent">CRM PIPELINE</Badge><h1 className="mt-3 font-display text-3xl font-semibold text-fg">Leads</h1><p className="mt-1 text-sm text-fg-muted">Track each enquiry from first contact to enrolment.</p></div><div className="rounded-xl border border-border-base bg-surface-card px-4 py-3 text-right"><p className="text-xs text-fg-muted">Total leads</p><p className="font-display text-2xl font-semibold text-fg">{total}</p></div></div>
                    <div className="mt-6 flex flex-col gap-2 md:flex-row"><Input aria-label="Search leads" placeholder="Search name or phone…" value={search} onChange={(event) => { setSearch(event.target.value); setPage(0) }} /><Select aria-label="Filter by status" className="md:w-52" placeholder="All statuses" value={filter} options={LEAD_STATUSES.map((status) => ({ value: status, label: STATUS_LABEL[status] }))} onChange={(event) => { setFilter(event.target.value as LeadStatus | ''); setPage(0) }} /></div>
                </Panel>
                {apiError && <ErrorBox>{errorMessage(apiError, 'Unable to load or update leads.')}</ErrorBox>}
                <div className="overflow-x-auto pb-2"><div className="grid min-w-[1040px] grid-cols-4 gap-4">
                    {LEAD_STATUSES.map((status) => <section key={status} className={`flex min-h-110 flex-col rounded-2xl border p-3 ${COLUMN_TONE[status]}`} onDragOver={(event) => event.preventDefault()} onDrop={() => drop(status)}>
                        <header className="mb-3 flex items-center justify-between px-1"><div><h2 className="font-display text-base font-semibold text-fg">{STATUS_LABEL[status]}</h2><p className="text-xs text-fg-muted">{grouped[status].length} lead{grouped[status].length === 1 ? '' : 's'}</p></div><Badge tone={STATUS_TONE[status]}>{grouped[status].length}</Badge></header>
                        <div className="flex flex-1 flex-col gap-3">{list.isLoading ? <div className="rounded-xl border border-dashed border-border-base bg-surface-card p-5 text-center text-sm text-fg-muted">Loading leads…</div> : grouped[status].length === 0 ? <div className="flex min-h-32 flex-1 items-center justify-center rounded-xl border border-dashed border-border-base bg-surface-card/60 px-4 text-center text-xs text-fg-muted">Drop a lead here</div> : grouped[status].map((lead) => <article key={lead.id} draggable onDragStart={() => setDraggedId(lead.id)} onDragEnd={() => setDraggedId(null)} className="cursor-grab rounded-xl border border-border-base bg-surface-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="truncate font-semibold text-fg">{lead.fullName || 'Unnamed lead'}</h3><a className="mt-1 block text-sm text-accent-fg hover:underline" href={`tel:${lead.phone ?? ''}`}>{lead.phone || 'No phone'}</a></div><Button size="sm" onClick={() => openEdit(lead)}>Edit</Button></div><div className="mt-3 flex flex-wrap gap-1.5">{lead.source && <Badge tone="slate">{lead.source}</Badge>}{lead.preferredCourse && <Badge tone="purple">{lead.preferredCourse}</Badge>}</div>{lead.callAt && <p className="mt-3 rounded-lg bg-warning-soft px-2.5 py-2 text-xs font-medium text-warning-fg">Call back: {formatDate(lead.callAt)}</p>}<div className="mt-3 flex items-center gap-2 border-t border-border-base pt-3"><Select aria-label={`Change ${lead.fullName ?? 'lead'} status`} className="text-xs" value={status} options={LEAD_STATUSES.map((value) => ({ value, label: STATUS_LABEL[value] }))} onChange={(event) => changeStatus(lead, event.target.value as LeadStatus)} /><button type="button" className="ml-auto text-xs font-medium text-danger-fg hover:underline" onClick={() => { if (confirm(`Delete ${lead.fullName || 'this lead'}?`)) mutations.remove.mutate(lead.id) }}>Delete</button></div></article>)}</div>
                    </section>)}
                </div></div>
                {!list.isLoading && leads.length === 0 && !apiError && <EmptyState title="No leads found" description="Try a different search, or add your first lead." />}
                {(list.data?.totalPages ?? 0) > 1 && <div className="flex justify-end gap-2"><Button size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button><Button size="sm" disabled={page + 1 >= (list.data?.totalPages ?? 1)} onClick={() => setPage(page + 1)}>Next</Button></div>}
            </div>
            {isFormOpen && <Modal eyebrow={editing ? 'EDIT LEAD' : 'NEW LEAD'} title={editing ? 'Edit lead' : 'Add lead'} onClose={closeModal} footer={<><Button onClick={closeModal}>Cancel</Button><Button variant="primary" onClick={save} disabled={!form.fullName.trim() || !PHONE_RE.test(form.phone.trim()) || mutations.create.isPending || mutations.update.isPending}>Save lead</Button></>}><div className="space-y-4"><Field label="Full name"><Input value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required /></Field><Field label="Phone"><Input type="tel" placeholder="+998901234567" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required /><p className="mt-1 text-xs text-fg-muted">International format, e.g. +998901234567</p></Field><Field label="Source"><Select placeholder="Select source" value={form.source} options={LEAD_SOURCES.map((source) => ({ value: source, label: source }))} onChange={(event) => setForm({ ...form, source: event.target.value as LeadSource | '' })} /></Field><Field label="Preferred course"><Input value={form.preferredCourse} onChange={(event) => setForm({ ...form, preferredCourse: event.target.value })} placeholder="e.g. English B1" /></Field></div></Modal>}
        </AppShell>
    )
}
