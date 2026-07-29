import { useEffect, useState, useCallback } from 'react'

/**
 * Teacher dashboard.
 *
 * Flow:
 *  - On load, GET .../groupInfo (no groupId) → backend auto-selects the
 *    nearest/ongoing group and returns { studentDto[], groupDto }.
 *  - The dropdown top-left is populated from GET .../groups (the teacher's
 *    own groups, lightweight {id,name} projection). Switching it re-fetches
 *    groupInfo with an explicit groupId.
 *  - "Start Lesson" POSTs to /api/v1/lesson with { groupId, lessonName }.
 *
 * ASSUMPTIONS (flag if wrong, will fix):
 *  - Both /groups and /groupInfo live under /api/v1/group — not confirmed,
 *    just inferred from GroupController being where they were shown.
 *  - "Start Lesson" prompts for a lessonName. If it should be auto-generated
 *    server-side instead, the input can just be dropped.
 *  - No attendance-marking UI yet — once a lesson is created, the dashboard
 *    just shows a confirmation card with the real id/lessonNumber/date it
 *    got back. Wire in the real attendance flow once you share
 *    AttendanceCreateDto + AttendanceController.
 */

const GROUP_ENDPOINT = '/api/v1/group'
const LESSON_ENDPOINT = '/api/v1/lesson'

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
    // Some endpoints return 200 with a fully empty body (not JSON null, not
    // 204) when there's nothing to return — res.json() throws on that, so
    // read as text first and only parse if there's actually something there.
    const text = await res.text()
    if (!text) return null
    try {
        return JSON.parse(text)
    } catch {
        return null
    }
}

function initials(name) {
    if (!name) return '?'
    return name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

function formatTimetable(tt) {
    if (!tt) return '—'
    const days = (tt.days || []).join('/')
    const time = tt.startTime && tt.endTime ? `${tt.startTime}–${tt.endTime}` : ''
    return [days, time].filter(Boolean).join(' · ') || '—'
}

export default function TeacherDashboard({ session, onLogout }) {
    const [groupOptions, setGroupOptions] = useState([])
    const [selectedGroupId, setSelectedGroupId] = useState('')
    const [groupInfo, setGroupInfo] = useState(null) // FullGroupDto
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState('')

    const [lessonModalOpen, setLessonModalOpen] = useState(false)
    const [lessonName, setLessonName] = useState('')
    const [startingLesson, setStartingLesson] = useState(false)
    const [lessonError, setLessonError] = useState('')
    const [activeLesson, setActiveLesson] = useState(null) // LessonDto once created

    // Load the teacher's own groups for the dropdown, once.
    useEffect(() => {
        authFetch(`${GROUP_ENDPOINT}/groups`, session.token)
            .then((list) => setGroupOptions(list || []))
            .catch(() => setGroupOptions([]))
    }, [session.token])

    const loadGroupInfo = useCallback(
        async (groupId) => {
            setLoading(true)
            setLoadError('')
            try {
                const params = groupId ? `?groupId=${encodeURIComponent(groupId)}` : ''
                const data = await authFetch(`${GROUP_ENDPOINT}/groupInfo${params}`, session.token)
                setGroupInfo(data)
                setSelectedGroupId(data?.groupDto?.id || '')
            } catch (err) {
                setLoadError(err.message)
                setGroupInfo(null)
            } finally {
                setLoading(false)
            }
        },
        [session.token]
    )

    // Initial load — no groupId, backend auto-selects nearest/ongoing.
    useEffect(() => {
        loadGroupInfo(null)
    }, [loadGroupInfo])

    function handleGroupChange(e) {
        const id = e.target.value
        setActiveLesson(null)
        loadGroupInfo(id)
    }

    async function handleStartLesson(e) {
        e.preventDefault()
        setStartingLesson(true)
        setLessonError('')
        try {
            const lesson = await authFetch(LESSON_ENDPOINT, session.token, {
                method: 'POST',
                body: JSON.stringify({ groupId: selectedGroupId, lessonName }),
            })
            setActiveLesson(lesson)
            setLessonModalOpen(false)
            setLessonName('')
        } catch (err) {
            setLessonError(err.message)
        } finally {
            setStartingLesson(false)
        }
    }

    const group = groupInfo?.groupDto
    const students = groupInfo?.studentDto || []

    return (
        <div style={s.page}>
            <style>{`
                .tch-btn { transition: background 0.15s ease, opacity 0.15s ease, transform 0.1s ease; cursor: pointer; }
                .tch-btn:hover { opacity: 0.88; }
                .tch-btn:active { transform: translateY(1px); }
                .tch-select { transition: border-color 0.15s ease; cursor: pointer; }
                .tch-select:hover { border-color: #b7ab8a; }
                .tch-row:hover { background: #f4efe3; }
                .tch-input { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
                .tch-input:focus {
                    outline: none;
                    border-color: #1f2a3d;
                    box-shadow: 0 0 0 3px rgba(31,42,61,0.08);
                }
            `}</style>

            <header style={s.header}>
                <div style={s.headerLeft}>
                    <div style={s.brand}>
                        <span style={s.mark}>CLC</span>
                        <span style={s.brandName}>Cornerstone · Teacher</span>
                    </div>

                    {groupOptions.length > 0 && (
                        <select
                            className="tch-select"
                            style={s.groupSelect}
                            value={selectedGroupId}
                            onChange={handleGroupChange}
                        >
                            {!selectedGroupId && <option value="">Select a group…</option>}
                            {groupOptions.map((g) => (
                                <option key={g.id} value={g.id}>
                                    {g.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div style={s.headerRight}>
                    <button
                        className="tch-btn"
                        style={s.startBtn}
                        disabled={!selectedGroupId}
                        onClick={() => setLessonModalOpen(true)}
                    >
                        ▶ Start Lesson
                    </button>
                    <button className="tch-btn" style={s.logoutBtn} onClick={onLogout}>
                        Sign out
                    </button>
                </div>
            </header>

            <main style={s.main}>
                {loading && <p style={s.status}>Loading your group…</p>}

                {loadError && (
                    <div style={s.errorBox}>Couldn't load group info: {loadError}</div>
                )}

                {activeLesson && (
                    <div style={s.lessonBanner}>
                        <span style={s.stamp}>In progress</span>
                        <div>
                            <div style={s.lessonBannerTitle}>
                                Lesson {activeLesson.lessonNumber} started
                            </div>
                            <div style={s.lessonBannerSub}>
                                {activeLesson.lessonDate} · id {activeLesson.id} — attendance marking
                                isn't wired up yet, coming once the Attendance API is shared.
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !loadError && group && (
                    <>
                        <div style={s.groupCard}>
                            <div style={s.groupCardHoles}>
                                <span /><span />
                            </div>
                            <div style={s.groupCardMain}>
                                <span style={s.eyebrow}>Current group</span>
                                <h1 style={s.groupName}>{group.name}</h1>
                                <div style={s.groupMeta}>
                                    <span>Room {group.room || '—'}</span>
                                    <span>·</span>
                                    <span>{formatTimetable(group.timeTable)}</span>
                                </div>
                            </div>
                            <span className="stamp" style={s.statusStamp}>
                                {group.status}
                            </span>
                        </div>

                        <div style={s.panel}>
                            <header style={s.panelHeader}>
                                <span style={s.eyebrow}>Roster</span>
                                <h2 style={s.panelTitle}>Students ({students.length})</h2>
                            </header>

                            <div style={s.tableWrap}>
                                <table style={s.table}>
                                    <thead>
                                    <tr>
                                        <th style={s.th}></th>
                                        <th style={s.th}>Full name</th>
                                        <th style={s.th}>Phone</th>
                                        <th style={s.th}>Birth date</th>
                                        <th style={s.th}>Parent phone</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan={5} style={s.tdEmpty}>
                                                No students in this group yet.
                                            </td>
                                        </tr>
                                    )}
                                    {students.map((st) => (
                                        <tr key={st.id} className="tch-row">
                                            <td style={{ ...s.td, width: 44 }}>
                                                {st.userDto?.imgUrl ? (
                                                    <img
                                                        src={st.userDto.imgUrl}
                                                        alt=""
                                                        style={s.avatarImg}
                                                    />
                                                ) : (
                                                    <div style={s.avatarFallback}>
                                                        {initials(st.userDto?.fullName)}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={s.td}>{st.userDto?.fullName || '—'}</td>
                                            <td style={s.td}>{st.userDto?.phone || '—'}</td>
                                            <td style={s.td}>{st.userDto?.birthDate || '—'}</td>
                                            <td style={s.td}>{st.parentPhone || '—'}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {!loading && !loadError && !group && (
                    <div style={s.emptyState}>
                        <p style={s.emptyTitle}>
                            {groupOptions.length === 0
                                ? "You don't have any groups yet."
                                : 'No upcoming lesson right now.'}
                        </p>
                        <p style={s.emptySub}>
                            {groupOptions.length === 0
                                ? "Once you're assigned to a group, it'll show up here."
                                : 'Pick a group from the dropdown above to view its roster.'}
                        </p>
                    </div>
                )}
            </main>

            {lessonModalOpen && (
                <div style={s.modalOverlay} onClick={() => setLessonModalOpen(false)}>
                    <div style={s.modal} onClick={(e) => e.stopPropagation()}>
                        <span style={s.eyebrow}>New lesson</span>
                        <h2 style={s.modalTitle}>Start lesson for {group?.name}</h2>

                        <form onSubmit={handleStartLesson} style={s.modalForm}>
                            <label style={s.field}>
                                <span style={s.eyebrowSmall}>Lesson name (optional)</span>
                                <input
                                    className="tch-input"
                                    style={s.input}
                                    value={lessonName}
                                    onChange={(e) => setLessonName(e.target.value)}
                                    placeholder="e.g. Present Simple — review"
                                    autoFocus
                                />
                            </label>

                            {lessonError && <p style={s.error}>{lessonError}</p>}

                            <div style={s.modalActions}>
                                <button
                                    type="button"
                                    className="tch-btn"
                                    style={s.cancelBtn}
                                    onClick={() => setLessonModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="tch-btn"
                                    style={s.saveBtn}
                                    disabled={startingLesson}
                                >
                                    {startingLesson ? 'Starting…' : 'Start lesson'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

// ---- design tokens, inline — same system as Login.jsx / AdminDashboard.jsx ----
const color = {
    paper: '#FAF6EE', paperLine: '#DDD3BC', card: '#FFFDF8', ink: '#1F2A3D',
    inkSoft: '#4B5768', inkFaint: '#8892A0', highlighter: '#F2B705',
    highlighterInk: '#5C4400', border: '#E2D9C4', claySoft: '#F6E6E1', clay: '#B4533C',
    forest: '#2F6B4F', forestSoft: '#E7F0EA',
}
const fontDisplay = "'Fraunces', ui-serif, Georgia, serif"
const fontBody = "'Work Sans', ui-sans-serif, system-ui, sans-serif"
const fontMono = "'IBM Plex Mono', ui-monospace, monospace"

const s = {
    page: { minHeight: '100vh', background: color.paper, fontFamily: fontBody },

    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 40px', borderBottom: `1px solid ${color.border}`, background: color.card, flexWrap: 'wrap', gap: 14 },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 20 },
    brand: { display: 'flex', alignItems: 'center', gap: 8 },
    mark: { fontFamily: fontMono, fontSize: '0.72rem', letterSpacing: '0.1em', background: color.highlighter, color: color.highlighterInk, padding: '2px 6px', borderRadius: 3 },
    brandName: { fontFamily: fontMono, fontSize: '0.78rem', letterSpacing: '0.03em', color: color.inkSoft },
    groupSelect: { fontFamily: fontBody, fontSize: '0.95rem', fontWeight: 500, padding: '8px 12px', border: `1px solid ${color.border}`, borderRadius: 4, background: color.paper, color: color.ink },
    headerRight: { display: 'flex', alignItems: 'center', gap: 10 },
    startBtn: { background: color.highlighter, color: color.highlighterInk, border: 'none', borderRadius: 4, padding: '10px 18px', fontSize: '0.9rem', fontWeight: 600, fontFamily: fontBody },
    logoutBtn: { background: 'transparent', border: `1px solid ${color.border}`, color: color.ink, padding: '9px 14px', borderRadius: 4, fontSize: '0.85rem', fontFamily: fontBody },

    main: { padding: '32px 40px 60px', maxWidth: 1000, margin: '0 auto', backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 27px, ${color.paperLine} 28px)`, backgroundPosition: '0 8px' },
    status: { color: color.inkFaint, fontFamily: fontMono, fontSize: '0.85rem' },
    errorBox: { background: color.claySoft, color: color.clay, borderRadius: 4, padding: '14px 16px', marginBottom: 20 },

    lessonBanner: { display: 'flex', alignItems: 'center', gap: 16, background: color.forestSoft, border: `1px solid ${color.forest}33`, borderRadius: 6, padding: '16px 20px', marginBottom: 24 },
    stamp: { display: 'inline-flex', flexShrink: 0, fontFamily: fontMono, fontSize: '0.65rem', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '3px 8px', border: `1.5px solid ${color.forest}`, borderRadius: 3, color: color.forest, transform: 'rotate(-2deg)' },
    lessonBannerTitle: { fontFamily: fontDisplay, fontWeight: 600, fontSize: '1.05rem', color: color.ink },
    lessonBannerSub: { fontSize: '0.85rem', color: color.inkSoft, marginTop: 2 },

    groupCard: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: color.card, border: `1px solid ${color.border}`, borderRadius: 6, padding: '22px 26px', marginBottom: 24, boxShadow: `0 1px 0 ${color.border}, 0 10px 30px -18px rgba(31,42,61,0.3)` },
    groupCardHoles: { position: 'absolute', top: 12, left: 20, display: 'flex', gap: 8 },
    groupCardMain: { paddingTop: 6 },
    eyebrow: { fontFamily: fontMono, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: color.inkFaint, display: 'block' },
    eyebrowSmall: { fontFamily: fontMono, fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: color.inkFaint },
    groupName: { fontFamily: fontDisplay, fontSize: '1.7rem', fontWeight: 600, color: color.ink, margin: '4px 0 6px' },
    groupMeta: { display: 'flex', gap: 8, fontSize: '0.88rem', color: color.inkSoft },
    statusStamp: { color: color.ink, borderColor: color.ink },

    panel: { background: color.card, border: `1px solid ${color.border}`, borderRadius: 6, padding: '24px 26px 20px', boxShadow: `0 1px 0 ${color.border}, 0 10px 30px -18px rgba(31,42,61,0.3)` },
    panelHeader: { marginBottom: 16 },
    panelTitle: { fontFamily: fontDisplay, fontSize: '1.3rem', fontWeight: 600, color: color.ink, margin: '4px 0 0' },

    tableWrap: { border: `1px solid ${color.border}`, borderRadius: 4, overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' },
    th: { textAlign: 'left', padding: '10px 14px', fontFamily: fontMono, fontSize: '0.66rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: color.inkFaint, borderBottom: `1px solid ${color.border}`, background: color.paper, whiteSpace: 'nowrap' },
    td: { padding: '10px 14px', borderBottom: `1px solid ${color.paperLine}`, color: color.ink, whiteSpace: 'nowrap' },
    tdEmpty: { padding: '26px 16px', textAlign: 'center', color: color.inkFaint },
    avatarImg: { width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', display: 'block' },
    avatarFallback: { width: 30, height: 30, borderRadius: '50%', background: color.highlighter, color: color.highlighterInk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fontDisplay, fontWeight: 700, fontSize: '0.75rem' },

    emptyState: { background: color.card, border: `1px dashed ${color.border}`, borderRadius: 6, padding: '34px 26px', textAlign: 'center' },
    emptyTitle: { fontFamily: fontDisplay, fontSize: '1.1rem', fontWeight: 600, color: color.ink, margin: '0 0 6px' },
    emptySub: { color: color.inkSoft, fontSize: '0.9rem', margin: 0 },

    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(31,42,61,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 },
    modal: { background: color.paper, borderRadius: 6, padding: '28px 30px', width: '100%', maxWidth: 420, boxShadow: '0 24px 60px -14px rgba(31,42,61,0.55)' },
    modalTitle: { fontFamily: fontDisplay, fontSize: '1.3rem', fontWeight: 600, color: color.ink, margin: '4px 0 18px' },
    modalForm: { display: 'flex', flexDirection: 'column', gap: 14 },
    field: { display: 'flex', flexDirection: 'column', gap: 5 },
    input: { fontFamily: fontBody, fontSize: '0.92rem', padding: '9px 11px', border: `1px solid ${color.border}`, borderRadius: 4, background: color.card, color: color.ink },
    error: { background: color.claySoft, color: color.clay, borderRadius: 4, padding: '9px 12px', fontSize: '0.83rem', margin: 0 },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
    cancelBtn: { background: 'transparent', border: `1px solid ${color.border}`, color: color.ink, padding: '9px 16px', borderRadius: 4, fontSize: '0.85rem', fontFamily: fontBody },
    saveBtn: { background: color.ink, color: color.paper, border: 'none', padding: '9px 18px', borderRadius: 4, fontSize: '0.85rem', fontWeight: 500, fontFamily: fontBody },
}