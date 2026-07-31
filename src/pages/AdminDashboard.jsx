import { useEffect, useState, useCallback } from 'react'

/**
 * Administrator dashboard — full CRUD across Students, Teachers, Groups,
 * and Lessons (Attendance excluded — admins don't need it here).
 *
 * ASSUMPTION still in place: create/edit form fields are inferred from
 * whatever the GET endpoints return (every key except `id`). If your
 * *CreateDto/*UpdateDto expect a different shape than the read Dto (e.g.
 * a flat `groupId` where the read Dto returns a nested `group` object),
 * share those DTOs and I'll lock the forms to the exact right shape.
 */

const ENTITIES = [
    { key: 'students', label: 'Students', endpoint: '/api/v1/student' },
    { key: 'teachers', label: 'Teachers', endpoint: '/api/v1/teacher' },
    { key: 'groups', label: 'Groups', endpoint: '/api/v1/group' },
    { key: 'lessons', label: 'Lessons', endpoint: '/api/v1/lesson' },
]

const PAGE_SIZE = 10
const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
const DAY_ABBR = {
    MONDAY: 'Mon', TUESDAY: 'Tue', WEDNESDAY: 'Wed', THURSDAY: 'Thu',
    FRIDAY: 'Fri', SATURDAY: 'Sat', SUNDAY: 'Sun',
}
const GROUP_STATUSES = [
    { value: 'STARTING', label: 'Starting' },
    { value: 'ONGOING', label: 'Ongoing' },
    { value: 'ENDED', label: 'Ended' },
]

function formatTime(t) {
    return typeof t === 'string' ? t.slice(0, 5) : t
}

async function authFetch(path, token, options = {}) {
    const res = await fetch(path, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    })
    if (!res.ok) {
        let message = `Request failed (${res.status})`
        try {
            const body = await res.json()
            message = body.message || body.error || message
        } catch {
            /* no json body */
        }
        throw new Error(message)
    }
    const text = await res.text()
    if (!text) return null
    try {
        return JSON.parse(text)
    } catch {
        return null
    }
}

function inferColumns(rows) {
    if (!rows || !rows.length) return []
    const keys = new Set()
    rows.forEach((row) => Object.keys(row).forEach((k) => keys.add(k)))
    keys.delete('id')
    return Array.from(keys)
}

function formatHeader(key) {
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (c) => c.toUpperCase())
}

function formatCell(value) {
    if (value === null || value === undefined) return '—'
    if (typeof value === 'object') return JSON.stringify(value)
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
}

/**
 * Per-entity form configs, for entities whose Create/Update DTOs don't
 * match their read Dto shape (e.g. nested objects). Entities not listed
 * here fall back to the generic auto-inferred form below.
 *
 * Students: StudentCreateDto{ userCreateDto{fullName,phone,birthDate,role}, parentPhone }
 *           StudentUpdateDto{ user{fullName,phone,birthDate}, parentPhone }
 *           Role is fixed to STUDENT here since we're creating via /api/v1/student.
 *           GET /api/v1/student's exact StudentDto shape isn't confirmed, so
 *           getInitialValues tries both a nested `user` object and flat
 *           fields as a fallback.
 */
const FORM_CONFIGS = {
    students: {
        fields: [
            { key: 'fullName', label: 'Full name', type: 'text' },
            { key: 'phone', label: 'Phone', type: 'tel' },
            { key: 'birthDate', label: 'Birth date', type: 'date' },
            { key: 'parentPhone', label: 'Parent phone', type: 'tel' },
        ],
        getInitialValues(row) {
            const user = row?.userDto || {}
            return {
                fullName: user.fullName ?? row?.fullName ?? '',
                phone: user.phone ?? row?.phone ?? '',
                birthDate: user.birthDate ?? row?.birthDate ?? '',
                parentPhone: row?.parentPhone ?? '',
            }
        },
        buildCreatePayload(values) {
            return {
                userCreateDto: {
                    fullName: values.fullName,
                    phone: values.phone,
                    birthDate: values.birthDate,
                    role: 'STUDENT',
                },
                parentPhone: values.parentPhone,
            }
        },
        buildUpdatePayload(values) {
            return {
                user: {
                    fullName: values.fullName,
                    phone: values.phone,
                    birthDate: values.birthDate,
                },
                parentPhone: values.parentPhone,
            }
        },
    },
    teachers: {
        fields: [
            { key: 'fullName', label: 'Full name', type: 'text' },
            { key: 'phone', label: 'Phone', type: 'tel' },
            { key: 'birthDate', label: 'Birth date', type: 'date' },
        ],
        getInitialValues(row) {
            const user = row?.userDto || {}
            return {
                fullName: user.fullName ?? '',
                phone: user.phone ?? '',
                birthDate: user.birthDate ?? '',
            }
        },
        buildCreatePayload(values) {
            return {
                user: {
                    fullName: values.fullName,
                    phone: values.phone,
                    birthDate: values.birthDate,
                    role: 'TEACHER',
                },
            }
        },
        buildUpdatePayload(values) {
            return {
                user: {
                    fullName: values.fullName,
                    phone: values.phone,
                    birthDate: values.birthDate,
                },
            }
        },
    },
    groups: {
        // Both create (TimeTableCreateDto) and update (TimeTableUpdateDto) take
        // the same nested shape: { days, startTime, endTime }. Edit mode reuses
        // the day-picker + time fields, pre-filled from the group's current
        // timetable, and adds the status selector on top.
        fields(mode) {
            const base = [
                { key: 'name', label: 'Group name', type: 'text' },
                { key: 'room', label: 'Room', type: 'text' },
                { key: 'teacherId', label: 'Teacher', type: 'select', optionsSource: 'teachers' },
                { key: 'days', label: 'Days', type: 'dayPicker' },
                { key: 'startTime', label: 'Start time', type: 'time' },
                { key: 'endTime', label: 'End time', type: 'time' },
            ]
            if (mode === 'edit') {
                base.push({
                    key: 'status',
                    label: 'Status',
                    type: 'select',
                    options: GROUP_STATUSES,
                })
            }
            return base
        },
        getInitialValues(row) {
            return {
                name: row?.name ?? '',
                room: row?.room ?? '',
                teacherId: row?.teacher?.id ?? '',
                days: row?.timeTable?.days ?? [],
                startTime: row?.timeTable?.startTime ? formatTime(row.timeTable.startTime) : '',
                endTime: row?.timeTable?.endTime ? formatTime(row.timeTable.endTime) : '',
                status: row?.status ?? 'STARTING',
            }
        },
        buildCreatePayload(values) {
            return {
                name: values.name,
                room: values.room,
                teacherId: values.teacherId,
                timeTable: {
                    days: values.days,
                    startTime: values.startTime,
                    endTime: values.endTime,
                },
            }
        },
        buildUpdatePayload(values) {
            return {
                name: values.name,
                room: values.room,
                teacherId: values.teacherId,
                timeTable: {
                    days: values.days,
                    startTime: values.startTime,
                    endTime: values.endTime,
                },
                status: values.status,
            }
        },
    },
}

/**
 * Table columns for entities with a form config — mirrors the form fields
 * so the table shows real values instead of a JSON dump of nested objects.
 */
const COLUMN_CONFIGS = {
    students: [
        { key: 'fullName', label: 'Full name', get: (row) => row?.userDto?.fullName },
        { key: 'phone', label: 'Phone', get: (row) => row?.userDto?.phone },
        { key: 'birthDate', label: 'Birth date', get: (row) => row?.userDto?.birthDate },
        { key: 'parentPhone', label: 'Parent phone', get: (row) => row?.parentPhone },
    ],
    teachers: [
        { key: 'fullName', label: 'Full name', get: (row) => row?.userDto?.fullName },
        { key: 'phone', label: 'Phone', get: (row) => row?.userDto?.phone },
        { key: 'birthDate', label: 'Birth date', get: (row) => row?.userDto?.birthDate },
    ],
    groups: [
        { key: 'name', label: 'Group name', get: (row) => row?.name },
        { key: 'room', label: 'Room', get: (row) => row?.room },
        { key: 'teacher', label: 'Teacher', get: (row) => row?.teacher?.userDto?.fullName },
        { key: 'timetable', label: 'Timetable', render: (row) => <TimetableCell tt={row?.timeTable} /> },
        { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row?.status} /> },
    ],
}

function TimetableCell({ tt }) {
    if (!tt) return <span style={{ color: color.inkFaint }}>—</span>
    const days = tt.days || []
    const start = tt.startTime ? formatTime(tt.startTime) : null
    const end = tt.endTime ? formatTime(tt.endTime) : null
    return (
        <div style={s.ttCell}>
            {days.length > 0 && (
                <div style={s.ttDays}>
                    {days.map((d) => (
                        <span key={d} style={s.dayBadge}>{DAY_ABBR[d] || d.slice(0, 3)}</span>
                    ))}
                </div>
            )}
            {(start || end) && (
                <div style={s.ttTimeCol}>
                    {start && <span style={s.ttTimeStart}>{start}</span>}
                    {end && <span style={s.ttTimeEnd}>{end}</span>}
                </div>
            )}
        </div>
    )
}

function statusStyle(status) {
    switch (status) {
        case 'STARTING': return { bg: color.amberSoft, fg: color.amberInk }
        case 'ONGOING': return { bg: color.sageSoft, fg: color.sageInk }
        case 'ENDED': return { bg: color.slateSoft, fg: color.slateInk }
        default: return { bg: color.paperLine, fg: color.inkSoft }
    }
}

function StatusBadge({ status }) {
    if (!status) return <span style={{ color: color.inkFaint }}>—</span>
    const st = statusStyle(status)
    return (
        <span style={{ ...s.statusBadge, background: st.bg, color: st.fg }}>
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
    )
}

function EditIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
    )
}

function TrashIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
    )
}

function UserPlusIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
        </svg>
    )
}

function IconButton({ variant = 'default', label, onClick, children }) {
    const isDanger = variant === 'danger'
    return (
        <button
            type="button"
            className={`adm-btn adm-icon-btn${isDanger ? ' adm-icon-btn-danger' : ''}`}
            style={isDanger ? s.iconBtnDanger : s.iconBtn}
            onClick={onClick}
            aria-label={label}
            title={label}
        >
            {children}
        </button>
    )
}

export default function AdminDashboard({ session, onLogout }) {
    const [activeTab, setActiveTab] = useState('students')
    const [rows, setRows] = useState([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('STARTING')
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')
    const [counts, setCounts] = useState({})
    const [modal, setModal] = useState(null)
    const [modalError, setModalError] = useState('')
    const [saving, setSaving] = useState(false)
    const [teacherOptions, setTeacherOptions] = useState([])
    const [assignModal, setAssignModal] = useState(null) // { group } | null — API to be wired in later

    const entity = ENTITIES.find((e) => e.key === activeTab)

    const loadTable = useCallback(async () => {
        setLoading(true)
        setLoadError('')
        try {
            const params = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE) })
            if (search) params.set('search', search)
            if (activeTab === 'groups' && statusFilter) params.set('status', statusFilter)
            const data = await authFetch(`${entity.endpoint}?${params}`, session.token)
            setRows(data.content || [])
            setTotalPages(data.totalPages ?? 1)
            setTotalElements(data.totalElements ?? (data.content || []).length)
        } catch (err) {
            setLoadError(err.message)
            setRows([])
        } finally {
            setLoading(false)
        }
    }, [entity.endpoint, page, search, statusFilter, activeTab, session.token])

    useEffect(() => {
        loadTable()
    }, [loadTable])

    useEffect(() => {
        setPage(0)
        setSearch('')
        setStatusFilter('STARTING')
    }, [activeTab])

    const loadCounts = useCallback(async () => {
        const results = {}
        for (const e of ENTITIES) {
            try {
                const raw = await authFetch(`${e.endpoint}/count`, session.token)
                // Handles both a bare number (5) and a wrapped object ({ count: 5 }) —
                // standardize on one shape across your controllers when you get the chance.
                const value = typeof raw === 'object' && raw !== null ? raw.count : raw
                results[e.key] = Number(value)
            } catch {
                results[e.key] = null
            }
        }
        setCounts(results)
    }, [session.token])

    useEffect(() => {
        loadCounts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Powers the Teacher dropdown on the Group create/edit form.
    useEffect(() => {
        authFetch('/api/v1/teacher?page=0&size=200', session.token)
            .then((data) => {
                const opts = (data.content || []).map((t) => ({
                    value: t.id,
                    label: t.userDto?.fullName || t.id,
                }))
                setTeacherOptions(opts)
            })
            .catch(() => setTeacherOptions([]))
    }, [session.token])

    const configuredColumns = COLUMN_CONFIGS[activeTab]
    const columns = configuredColumns ? configuredColumns.map((c) => c.key) : inferColumns(rows)
    const formConfig = FORM_CONFIGS[activeTab]

    function openCreate() {
        if (formConfig) {
            setModal({ mode: 'create', values: formConfig.getInitialValues(null), id: null })
        } else {
            const template = {}
            columns.forEach((c) => (template[c] = ''))
            setModal({ mode: 'create', values: template, id: null })
        }
        setModalError('')
    }

    function openEdit(row) {
        if (formConfig) {
            setModal({ mode: 'edit', values: formConfig.getInitialValues(row), id: row.id })
        } else {
            setModal({ mode: 'edit', values: { ...row }, id: row.id })
        }
        setModalError('')
    }

    function openAssignStudents(row) {
        // Placeholder — wire this up to the real endpoint once it's shared.
        setAssignModal({ group: row })
    }

    async function handleDelete(row) {
        if (!confirm(`Delete this ${entity.label.slice(0, -1).toLowerCase()}? This can't be undone.`)) return
        try {
            await authFetch(`${entity.endpoint}/${row.id}`, session.token, { method: 'DELETE' })
            loadTable()
            loadCounts()
        } catch (err) {
            alert(`Couldn't delete: ${err.message}`)
        }
    }

    async function handleModalSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setModalError('')
        try {
            let body
            if (formConfig) {
                body =
                    modal.mode === 'create'
                        ? formConfig.buildCreatePayload(modal.values)
                        : formConfig.buildUpdatePayload(modal.values)
            } else {
                body = { ...modal.values }
                delete body.id
            }
            if (modal.mode === 'create') {
                await authFetch(entity.endpoint, session.token, {
                    method: 'POST',
                    body: JSON.stringify(body),
                })
            } else {
                await authFetch(`${entity.endpoint}/${modal.id}`, session.token, {
                    method: 'PUT',
                    body: JSON.stringify(body),
                })
            }
            setModal(null)
            loadTable()
            loadCounts()
        } catch (err) {
            setModalError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div style={s.page}>
            <style>{`
                .adm-tab { transition: color 0.15s ease, background 0.15s ease, border-color 0.15s ease; }
                .adm-tab:hover { color: #faf6ee; background: rgba(250,246,238,0.05); }
                .adm-row:hover { background: #f4efe3; }
                .adm-btn { transition: background 0.15s ease, opacity 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease, border-color 0.15s ease; cursor: pointer; }
                .adm-btn:active { transform: translateY(1px); }
                .adm-input { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
                .adm-input:hover { border-color: #b7ab8a; }
                .adm-input:focus {
                    outline: none;
                    border-color: #1f2a3d;
                    box-shadow: 0 0 0 3px rgba(31,42,61,0.1);
                }
                .adm-icon-btn:hover { background: #1f2a3d; color: #faf6ee; border-color: #1f2a3d; }
                .adm-icon-btn-danger:hover { background: #b4533c !important; color: #fff !important; border-color: #b4533c !important; }
                .adm-stat:hover { transform: translateY(-2px); box-shadow: 0 1px 0 #e2d9c4, 0 12px 24px -12px rgba(31,42,61,0.3); }
                .adm-select:hover { border-color: #b7ab8a; }
                .adm-newbtn:hover { transform: translateY(-1px); box-shadow: 0 10px 22px -6px rgba(31,42,61,0.6); }
                .adm-pagebtn:hover:not(:disabled) { border-color: #1f2a3d; color: #1f2a3d; }
                .adm-pagebtn:disabled { opacity: 0.45; cursor: default; }
            `}</style>

            <aside style={s.sidebar}>
                <div style={s.sidebarBrand}>
                    <span style={s.mark}>CLC</span>
                    <span style={s.sidebarBrandName}>Cornerstone</span>
                </div>

                <nav style={s.sidebarNav}>
                    {ENTITIES.map((e) => (
                        <button
                            key={e.key}
                            className="adm-tab"
                            onClick={() => setActiveTab(e.key)}
                            style={{
                                ...s.sidebarTab,
                                ...(activeTab === e.key ? s.sidebarTabActive : {}),
                            }}
                        >
                            {e.label}
                        </button>
                    ))}
                </nav>

                <div style={s.sidebarFooter}>
                    <div style={s.sidebarRole}>Administrator</div>
                    <button className="adm-btn" style={s.logoutBtn} onClick={onLogout}>
                        Sign out
                    </button>
                </div>
            </aside>

            <main style={s.main}>
                <div style={s.statsRow}>
                    {ENTITIES.map((e) => (
                        <div key={e.key} className="adm-stat" style={{ ...s.statCard, borderTopColor: ENTITY_ACCENT[e.key] }}>
                            <div style={s.statHoles}>
                                <span /><span />
                            </div>
                            <div style={s.statLabel}>{e.label}</div>
                            <div style={s.statValue}>
                                {counts[e.key] === null ? '—' : counts[e.key] ?? '···'}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={s.panel}>
                    <header style={s.panelHeader}>
                        <div>
                            <span style={s.eyebrow}>Records</span>
                            <h1 style={s.panelTitle}>{entity.label}</h1>
                        </div>
                        <div style={s.toolbar}>
                            {activeTab === 'groups' && (
                                <select
                                    className="adm-input adm-select"
                                    style={s.filterSelect}
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value)
                                        setPage(0)
                                    }}
                                >
                                    {GROUP_STATUSES.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            )}
                            <input
                                className="adm-input"
                                style={s.search}
                                placeholder={`Search ${entity.label.toLowerCase()}…`}
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setPage(0)
                                }}
                            />
                            <button className="adm-btn adm-newbtn" style={s.newBtn} onClick={openCreate}>
                                + New {entity.label.slice(0, -1)}
                            </button>
                        </div>
                    </header>

                    {loadError && (
                        <div style={s.errorBox}>
                            Couldn't load {entity.label.toLowerCase()}: {loadError}
                        </div>
                    )}

                    {!loadError && (
                        <div style={s.tableWrap}>
                            <table style={s.table}>
                                <thead>
                                <tr>
                                    {columns.map((c) => (
                                        <th key={c} style={s.th}>
                                            {configuredColumns
                                                ? configuredColumns.find((cc) => cc.key === c).label
                                                : formatHeader(c)}
                                        </th>
                                    ))}
                                    <th style={{ ...s.th, textAlign: 'right' }}>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={columns.length + 1} style={s.tdEmpty}>Loading…</td>
                                    </tr>
                                )}
                                {!loading && rows.length === 0 && (
                                    <tr>
                                        <td colSpan={columns.length + 1} style={s.tdEmpty}>
                                            No {entity.label.toLowerCase()} found.
                                        </td>
                                    </tr>
                                )}
                                {!loading &&
                                    rows.map((row) => (
                                        <tr key={row.id} className="adm-row">
                                            {columns.map((c) => {
                                                const cc = configuredColumns?.find((x) => x.key === c)
                                                return (
                                                    <td key={c} style={s.td}>
                                                        {cc?.render ? cc.render(row) : formatCell(cc ? cc.get(row) : row[c])}
                                                    </td>
                                                )
                                            })}
                                            <td style={{ ...s.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                                                <div style={s.actionsCell}>
                                                    {activeTab === 'groups' && (
                                                        <IconButton label="Add students" onClick={() => openAssignStudents(row)}>
                                                            <UserPlusIcon />
                                                        </IconButton>
                                                    )}
                                                    <IconButton label="Edit" onClick={() => openEdit(row)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton label="Delete" variant="danger" onClick={() => handleDelete(row)}>
                                                        <TrashIcon />
                                                    </IconButton>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div style={s.pagination}>
                        <button
                            className="adm-btn adm-pagebtn"
                            style={s.pageBtn}
                            disabled={page <= 0}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                        >
                            ← Prev
                        </button>
                        <span style={s.pageInfo}>
                            Page {page + 1} of {Math.max(totalPages, 1)} · {totalElements} total
                        </span>
                        <button
                            className="adm-btn adm-pagebtn"
                            style={s.pageBtn}
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </main>

            {modal && (
                <div style={s.modalOverlay} onClick={() => setModal(null)}>
                    <div style={s.modal} onClick={(e) => e.stopPropagation()}>
                        <span style={s.eyebrow}>{modal.mode === 'create' ? 'New record' : 'Edit record'}</span>
                        <h2 style={s.modalTitle}>
                            {modal.mode === 'create'
                                ? `New ${entity.label.slice(0, -1)}`
                                : `Edit ${entity.label.slice(0, -1)}`}
                        </h2>

                        {!formConfig && columns.length === 0 ? (
                            <p style={s.modalNote}>
                                No existing records to infer fields from yet — add one directly via
                                your API, then this form will auto-populate with the right fields.
                            </p>
                        ) : (
                            <form onSubmit={handleModalSubmit} style={s.modalForm}>
                                {(formConfig
                                        ? typeof formConfig.fields === 'function'
                                            ? formConfig.fields(modal.mode)
                                            : formConfig.fields
                                        : columns.map((c) => ({ key: c, label: formatHeader(c), type: 'text' }))
                                ).map((f) => (
                                    <label key={f.key} style={s.field}>
                                        <span style={s.eyebrowSmall}>{f.label}</span>
                                        {f.type === 'select' ? (
                                            <select
                                                className="adm-input"
                                                style={s.input}
                                                value={modal.values[f.key] ?? ''}
                                                onChange={(e) =>
                                                    setModal((m) => ({
                                                        ...m,
                                                        values: { ...m.values, [f.key]: e.target.value },
                                                    }))
                                                }
                                            >
                                                <option value="">— Select —</option>
                                                {(f.optionsSource === 'teachers' ? teacherOptions : f.options || []).map(
                                                    (opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        ) : f.type === 'dayPicker' ? (
                                            <div style={s.dayPicker}>
                                                {DAYS.map((day) => {
                                                    const selected = (modal.values[f.key] || []).includes(day)
                                                    return (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            className="adm-btn"
                                                            style={{
                                                                ...s.dayPill,
                                                                ...(selected ? s.dayPillActive : {}),
                                                            }}
                                                            onClick={() =>
                                                                setModal((m) => {
                                                                    const current = m.values[f.key] || []
                                                                    const next = selected
                                                                        ? current.filter((d) => d !== day)
                                                                        : [...current, day]
                                                                    return { ...m, values: { ...m.values, [f.key]: next } }
                                                                })
                                                            }
                                                        >
                                                            {day.slice(0, 3)}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <input
                                                type={f.type}
                                                lang={f.type === 'time' ? 'ru-RU' : undefined}
                                                className="adm-input"
                                                style={s.input}
                                                value={
                                                    typeof modal.values[f.key] === 'object' && modal.values[f.key] !== null
                                                        ? JSON.stringify(modal.values[f.key])
                                                        : modal.values[f.key] ?? ''
                                                }
                                                onChange={(e) =>
                                                    setModal((m) => ({
                                                        ...m,
                                                        values: { ...m.values, [f.key]: e.target.value },
                                                    }))
                                                }
                                            />
                                        )}
                                    </label>
                                ))}

                                {modalError && <p style={s.error}>{modalError}</p>}

                                <div style={s.modalActions}>
                                    <button
                                        type="button"
                                        className="adm-btn"
                                        style={s.cancelBtn}
                                        onClick={() => setModal(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="adm-btn" style={s.saveBtn} disabled={saving}>
                                        {saving ? 'Saving…' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {assignModal && (
                <div style={s.modalOverlay} onClick={() => setAssignModal(null)}>
                    <div style={s.modal} onClick={(e) => e.stopPropagation()}>
                        <span style={s.eyebrow}>Assign students</span>
                        <h2 style={s.modalTitle}>Add students to {assignModal.group?.name}</h2>
                        <p style={s.modalNote}>
                            Student assignment isn't wired up yet — once the endpoint is shared,
                            this will become a picker for adding students to this group.
                        </p>
                        <div style={s.modalActions}>
                            <button
                                type="button"
                                className="adm-btn"
                                style={s.cancelBtn}
                                onClick={() => setAssignModal(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ---- design tokens, inline — same system as Login.jsx ----
const color = {
    paper: '#FAF6EE', paperLine: '#DDD3BC', card: '#FFFDF8', ink: '#1F2A3D',
    inkSoft: '#4B5768', inkFaint: '#8892A0', highlighter: '#F2B705',
    highlighterInk: '#5C4400', border: '#E2D9C4', claySoft: '#F6E6E1', clay: '#B4533C',
    // accent set — used to warm up the background and color-code status/stat cards
    sage: '#5E8368', sageSoft: '#E3ECE0', sageInk: '#3C5F44',
    amber: '#C97A2B', amberSoft: '#FBEAD2', amberInk: '#8A5416',
    steel: '#3E6B8A', steelSoft: '#E2EBF0', steelInk: '#2B4F66',
    slateSoft: '#EAE7DD', slateInk: '#6B7280',
}
const fontDisplay = "'Fraunces', ui-serif, Georgia, serif"
const fontBody = "'Work Sans', ui-sans-serif, system-ui, sans-serif"
const fontMono = "'IBM Plex Mono', ui-monospace, monospace"

const ENTITY_ACCENT = { students: color.clay, teachers: color.sage, groups: color.amber, lessons: color.steel }

const s = {
    page: {
        minHeight: '100vh', display: 'flex', fontFamily: fontBody,
        background: `linear-gradient(160deg, #FCF4E6 0%, #F6EEDC 45%, #F1E8D3 100%)`,
    },

    sidebar: { width: 220, flexShrink: 0, background: color.ink, color: color.paper, display: 'flex', flexDirection: 'column', padding: '24px 0', minHeight: '100vh' },
    sidebarBrand: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 20px 24px', borderBottom: '1px solid rgba(250,246,238,0.12)', marginBottom: 12 },
    mark: { fontFamily: fontMono, fontSize: '0.72rem', letterSpacing: '0.1em', background: color.highlighter, color: color.highlighterInk, padding: '2px 6px', borderRadius: 3 },
    sidebarBrandName: { fontFamily: fontDisplay, fontSize: '1rem', fontWeight: 600 },
    sidebarNav: { display: 'flex', flexDirection: 'column', flex: 1 },
    sidebarTab: { textAlign: 'left', background: 'none', border: 'none', borderLeft: '3px solid transparent', color: 'rgba(250,246,238,0.65)', fontSize: '0.9rem', padding: '12px 20px 12px 24px', cursor: 'pointer', fontFamily: fontBody },
    sidebarTabActive: { color: color.paper, borderLeftColor: color.highlighter, background: 'rgba(250,246,238,0.06)', fontWeight: 500 },
    sidebarFooter: { padding: '16px 20px 0', borderTop: '1px solid rgba(250,246,238,0.12)' },
    sidebarRole: { fontFamily: fontMono, fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(250,246,238,0.45)', marginBottom: 10 },
    logoutBtn: { width: '100%', background: 'transparent', border: '1px solid rgba(250,246,238,0.25)', color: color.paper, padding: '8px 12px', borderRadius: 4, fontSize: '0.82rem', fontFamily: fontBody },

    main: {
        flex: 1, padding: '36px 44px 60px',
        background: `radial-gradient(circle at 12% -10%, rgba(201,122,43,0.07), transparent 42%),
                     radial-gradient(circle at 92% 15%, rgba(94,131,104,0.06), transparent 40%),
                     #F5F0E2`,
    },

    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
    statCard: { position: 'relative', background: color.card, border: `1px solid ${color.border}`, borderTop: '3px solid transparent', borderRadius: 6, padding: '22px 18px 16px', boxShadow: `0 1px 0 ${color.border}, 0 6px 16px -10px rgba(31,42,61,0.25)`, transition: 'transform 0.15s ease, box-shadow 0.15s ease' },
    statHoles: { position: 'absolute', top: 10, left: 16, display: 'flex', gap: 8 },
    statLabel: { fontFamily: fontMono, fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: color.inkFaint, marginTop: 6, marginBottom: 6 },
    statValue: { fontFamily: fontDisplay, fontSize: '1.9rem', fontWeight: 600, color: color.ink },

    panel: { background: color.card, border: `1px solid ${color.border}`, borderRadius: 8, padding: '26px 28px 22px', boxShadow: `0 1px 0 ${color.border}, 0 10px 30px -18px rgba(31,42,61,0.3)` },
    panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14, marginBottom: 20 },
    eyebrow: { fontFamily: fontMono, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: color.inkFaint, display: 'block' },
    eyebrowSmall: { fontFamily: fontMono, fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: color.inkFaint },
    panelTitle: { fontFamily: fontDisplay, fontSize: '1.6rem', fontWeight: 600, color: color.ink, margin: '4px 0 0' },

    toolbar: { display: 'flex', gap: 10, alignItems: 'center' },
    search: {
        minWidth: 220, fontFamily: fontBody, fontSize: '0.88rem', padding: '9px 14px',
        border: `1px solid ${color.border}`, borderRadius: 8, background: color.card, color: color.ink,
        height: 38, boxSizing: 'border-box', boxShadow: 'inset 0 1px 2px rgba(31,42,61,0.05)',
    },
    filterSelect: {
        fontFamily: fontBody, fontSize: '0.85rem', fontWeight: 500, padding: '9px 34px 9px 14px',
        border: `1px solid ${color.border}`, borderRadius: 8, background: color.card, color: color.ink,
        height: 38, boxSizing: 'border-box', cursor: 'pointer', boxShadow: 'inset 0 1px 2px rgba(31,42,61,0.05)',
        appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%234B5768' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
    },
    newBtn: {
        background: `linear-gradient(155deg, #26314A 0%, ${color.ink} 100%)`, color: color.paper, border: 'none',
        borderRadius: 8, padding: '9px 20px', fontSize: '0.85rem', fontWeight: 600, fontFamily: fontBody,
        whiteSpace: 'nowrap', height: 38, boxShadow: '0 6px 16px -6px rgba(31,42,61,0.55)', letterSpacing: '0.01em',
    },

    errorBox: { background: color.claySoft, color: color.clay, borderRadius: 6, padding: '14px 16px', marginBottom: 16 },

    tableWrap: { border: `1px solid ${color.border}`, borderRadius: 6, overflowX: 'auto', marginBottom: 18 },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' },
    th: { textAlign: 'left', padding: '11px 16px', fontFamily: fontMono, fontSize: '0.66rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: color.inkFaint, borderBottom: `1px solid ${color.border}`, background: color.paper, whiteSpace: 'nowrap' },
    td: { padding: '12px 16px', borderBottom: `1px solid ${color.paperLine}`, color: color.ink, whiteSpace: 'nowrap' },
    tdEmpty: { padding: '30px 16px', textAlign: 'center', color: color.inkFaint },
    actionsCell: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
    iconBtn: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32,
        borderRadius: 8, border: `1px solid ${color.border}`, background: color.paper, color: color.inkSoft, cursor: 'pointer',
    },
    iconBtnDanger: {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32,
        borderRadius: 8, border: `1px solid ${color.claySoft}`, background: color.claySoft, color: color.clay, cursor: 'pointer',
    },

    pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 },
    pageBtn: { background: color.card, border: `1px solid ${color.border}`, color: color.ink, padding: '7px 16px', borderRadius: 8, fontSize: '0.82rem', fontFamily: fontBody, fontWeight: 500 },
    pageInfo: { fontFamily: fontMono, fontSize: '0.74rem', color: color.inkFaint },

    // timetable cell — day badges stacked to the left, start/end time stacked beside them
    ttCell: { display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'flex-start', whiteSpace: 'normal' },
    ttDays: { display: 'flex', flexDirection: 'column', gap: 3 },
    dayBadge: {
        fontFamily: fontMono, fontSize: '0.63rem', letterSpacing: '0.04em', textTransform: 'uppercase',
        color: color.steelInk, background: color.steelSoft, padding: '1px 7px', borderRadius: 10,
        width: 'fit-content', fontWeight: 500,
    },
    ttTimeCol: { display: 'flex', flexDirection: 'column', gap: 3, borderLeft: `2px solid ${color.border}`, paddingLeft: 10 },
    ttTimeStart: { fontFamily: fontMono, fontSize: '0.78rem', color: color.ink, fontWeight: 600, lineHeight: 1.3 },
    ttTimeEnd: { fontFamily: fontMono, fontSize: '0.78rem', color: color.inkSoft, lineHeight: 1.3 },

    statusBadge: {
        display: 'inline-flex', alignItems: 'center', fontFamily: fontBody, fontSize: '0.78rem',
        fontWeight: 600, padding: '4px 12px', borderRadius: 20,
    },

    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(31,42,61,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 },
    modal: { background: color.paper, borderRadius: 6, padding: '28px 30px', width: '100%', maxWidth: 440, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 60px -14px rgba(31,42,61,0.55)' },
    modalTitle: { fontFamily: fontDisplay, fontSize: '1.4rem', fontWeight: 600, color: color.ink, margin: '4px 0 18px' },
    modalNote: { color: color.inkSoft, fontSize: '0.9rem', lineHeight: 1.5 },
    modalForm: { display: 'flex', flexDirection: 'column', gap: 14 },
    field: { display: 'flex', flexDirection: 'column', gap: 5 },
    input: { fontFamily: fontBody, fontSize: '0.92rem', padding: '9px 11px', border: `1px solid ${color.border}`, borderRadius: 4, background: color.card, color: color.ink },
    error: { background: color.claySoft, color: color.clay, borderRadius: 4, padding: '9px 12px', fontSize: '0.83rem', margin: 0 },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
    cancelBtn: { background: 'transparent', border: `1px solid ${color.border}`, color: color.ink, padding: '9px 16px', borderRadius: 4, fontSize: '0.85rem', fontFamily: fontBody },
    saveBtn: { background: color.ink, color: color.paper, border: 'none', padding: '9px 18px', borderRadius: 4, fontSize: '0.85rem', fontWeight: 500, fontFamily: fontBody },

    dayPicker: { display: 'flex', gap: 6, flexWrap: 'wrap' },
    dayPill: { background: color.card, border: `1px solid ${color.border}`, color: color.inkSoft, padding: '7px 10px', borderRadius: 4, fontSize: '0.78rem', fontFamily: fontMono, letterSpacing: '0.03em', textTransform: 'uppercase' },
    dayPillActive: { background: color.ink, borderColor: color.ink, color: color.paper },
}