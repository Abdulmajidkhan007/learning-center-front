import { useEffect, useState, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

const ATTENDANCE_ENDPOINT = '/api/v1/attendance'

function formatDate(d) {
    if (!d) return ''
    return d.slice(0, 10)
}

function authFetch(path, token, options = {}) {
    return fetch(path, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    }).then(async (res) => {
        if (!res.ok) {
            let message = `Request failed (${res.status})`
            try { const body = await res.json(); message = body.message || body.error || message } catch { }
            throw new Error(message)
        }
        const text = await res.text()
        if (!text) return null
        return JSON.parse(text)
    })
}

const STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']

export default function AttendancePage({ standalone, session: propSession, onLogout: propOnLogout, onBack: propOnBack, students: propStudents, activeLesson: propActiveLesson, onLessonFinished: propOnLessonFinished }) {
    const { session: ctxSession, onLogout: ctxOnLogout } = useContext(AuthContext) || {}
    const location = useLocation()
    const navigate = useNavigate()

    const session = standalone ? ctxSession : propSession
    const onLogout = standalone ? ctxOnLogout : propOnLogout
    const onBack = standalone ? (propOnBack || (() => navigate('/'))) : propOnBack
    const groupStudents = standalone ? (location.state?.students || []) : propStudents
    const activeLesson = standalone ? (location.state?.activeLesson || null) : propActiveLesson
    const onLessonFinished = standalone ? (propOnLessonFinished || (() => navigate('/'))) : propOnLessonFinished
    const [records, setRecords] = useState([])
    const [draftMap, setDraftMap] = useState({})
    const [draftLessonInfo, setDraftLessonInfo] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const groupStudentIds = new Set((groupStudents || []).map((st) => st.id))

    useEffect(() => {
        if (!session || !groupStudents.length) return
        authFetch(`${ATTENDANCE_ENDPOINT}?size=200`, session.token)
            .then((data) => {
                const all = data?.content || data || []
                const filtered = all.filter((r) =>
                    (r.attendanceStudents || []).some((as) => groupStudentIds.has(as.studentId))
                )
                setRecords(filtered)
            })
            .catch(() => {})
    }, [session?.token, groupStudents.length])

    useEffect(() => {
        if (activeLesson) startDraft(activeLesson)
    }, [activeLesson?.id])

    function startDraft(lessonInfo) {
        if (!groupStudents.length) return
        const map = {}
        groupStudents.forEach((st) => { map[st.id] = 'PRESENT' })
        setDraftMap(map)
        setDraftLessonInfo(lessonInfo)
        setError('')
    }

    async function handleFinish() {
        setSubmitting(true)
        setError('')
        try {
            const body = {
                lessonId: draftLessonInfo.id,
                students: Object.entries(draftMap).map(([studentId, status]) => ({
                    studentId,
                    status,
                })),
            }
            const created = await authFetch(ATTENDANCE_ENDPOINT, session.token, {
                method: 'POST',
                body: JSON.stringify(body),
            })
            setRecords((prev) => [{
                lessonId: draftLessonInfo.id,
                createdAt: created?.createdAt || new Date().toISOString(),
                attendanceStudents: created?.attendanceStudents || body.students,
            }, ...prev])
            setDraftMap({})
            setDraftLessonInfo(null)
            if (onLessonFinished) onLessonFinished()
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    function getStudentStatus(studentId, attendanceStudents) {
        const found = (attendanceStudents || []).find((s) => s.studentId === studentId)
        return found ? found.status : null
    }

    const pastColumns = records.map((r) => ({
        lessonId: r.lessonId,
        date: r.createdAt,
        attendanceStudents: r.attendanceStudents || [],
    }))

    const students = groupStudents || []
    const hasDraft = draftLessonInfo && Object.keys(draftMap).length > 0

    const draftCounts = { PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0 }
    if (hasDraft) {
        Object.values(draftMap).forEach((status) => { draftCounts[status]++ })
    }

    return (
        <div style={s.page}>
            <style>{`
                .att-row:hover { background: #f4efe3; }
                .att-cell-select { transition: border-color 0.15s ease; cursor: pointer; }
                .att-cell-select:hover { border-color: #b7ab8a; }
            `}</style>
            <header style={s.header}>
                <div style={s.headerInner}>
                    <div style={s.brand}>
                        <span style={s.mark}>CLC</span>
                        <span style={s.brandName}>Cornerstone · Attendance</span>
                    </div>
                    <div style={s.headerRight}>
                        <button style={s.backBtn} onClick={onBack}>← Back to Dashboard</button>
                        <button style={s.logoutBtn} onClick={onLogout}>Sign out</button>
                    </div>
                </div>
            </header>

            <main style={s.main}>
                {error && <div style={s.errorBox}>{error}</div>}

                {students.length === 0 ? (
                    <div style={s.emptyState}>
                        <p style={s.emptyTitle}>No students in this group</p>
                        <p style={s.emptySub}>Add students to the group to start taking attendance.</p>
                    </div>
                ) : (
                    <>
                        <div style={s.toolbarRow}>
                            {pastColumns.length > 0 && <span style={s.toolbarLabel}>{pastColumns.length} past lesson{pastColumns.length !== 1 ? 's' : ''}</span>}
                        </div>

                        {hasDraft && (
                            <div style={s.draftBar}>
                                <div style={s.draftSummary}>
                                    {STATUSES.map((status) => (
                                        draftCounts[status] > 0 && (
                                            <span key={status} style={{ ...s.draftBadge, ...s[`badge${status}`] }}>
                                                {status.charAt(0) + status.slice(1).toLowerCase()}: {draftCounts[status]}
                                            </span>
                                        )
                                    ))}
                                </div>
                                <button style={s.finishBtn} onClick={handleFinish} disabled={submitting}>
                                    {submitting ? 'Submitting…' : 'Finish Attendance'}
                                </button>
                            </div>
                        )}

                        <div style={s.tableWrap}>
                            <table style={s.table}>
                                <thead>
                                <tr>
                                    <th style={s.thName}>Student</th>
                                    {pastColumns.map((col) => (
                                        <th key={col.lessonId} style={s.thDate}>
                                            <span style={s.thDateLabel}>{formatDate(col.date)}</span>
                                            <span style={s.thLessonLabel}>{col.lessonId.slice(0, 8)}</span>
                                        </th>
                                    ))}
                                    {hasDraft && (
                                        <th style={s.thDraft}>
                                            <span style={s.thDateLabel}>{formatDate(draftLessonInfo.lessonDate)}</span>
                                            <span style={s.thLessonLabel}>Lesson {draftLessonInfo.lessonNumber}</span>
                                        </th>
                                    )}
                                </tr>
                                </thead>
                                <tbody>
                                {students.map((st, i) => {
                                    const studentId = st.id
                                    return (
                                        <tr key={studentId} className="att-row">
                                            <td style={s.tdName}>
                                                <span style={s.tdRank}>{i + 1}</span>
                                                {st.userDto?.fullName || '—'}
                                            </td>
                                            {pastColumns.map((col) => {
                                                const status = getStudentStatus(studentId, col.attendanceStudents)
                                                return (
                                                    <td key={col.lessonId} style={s.tdCell}>
                                                        {status ? (
                                                            <span style={{ ...s.cellBadge, ...s[`badge${status}`] }}>
                                                                {status.charAt(0)}
                                                            </span>
                                                        ) : (
                                                            <span style={s.cellEmpty}>—</span>
                                                        )}
                                                    </td>
                                                )
                                            })}
                                            {hasDraft && (
                                                <td style={s.tdCell}>
                                                    <select
                                                        className="att-cell-select"
                                                        style={s.cellSelect}
                                                        value={draftMap[studentId] || 'PRESENT'}
                                                        onChange={(e) => setDraftMap((prev) => ({ ...prev, [studentId]: e.target.value }))}
                                                    >
                                                        {STATUSES.map((status) => (
                                                            <option key={status} value={status}>
                                                                {status.charAt(0) + status.slice(1).toLowerCase()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            )}
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}

const color = {
    paper: '#FAF6EE', paperLine: '#DDD3BC', card: '#FFFDF8', ink: '#1F2A3D',
    inkSoft: '#4B5768', inkFaint: '#8892A0', highlighter: '#F2B705',
    highlighterInk: '#5C4400', border: '#E2D9C4', claySoft: '#F6E6E1', clay: '#B4533C',
    forest: '#2F6B4F', forestSoft: '#E7F0EA',
    accent: '#4C5FD5', accentSoft: '#EAECFB',
    purple: '#8B5CF6', purpleSoft: '#F1EBFD', magenta: '#C244B0',
}
const fontDisplay = "'Fraunces', ui-serif, Georgia, serif"
const fontBody = "'Work Sans', ui-sans-serif, system-ui, sans-serif"
const fontMono = "'IBM Plex Mono', ui-monospace, monospace"

const s = {
    page: { minHeight: '100vh', background: color.paper, fontFamily: fontBody },

    header: { background: color.card, borderBottom: `1px solid ${color.border}`, padding: '14px 40px' },
    headerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    brand: { display: 'flex', alignItems: 'center', gap: 8 },
    mark: { fontFamily: fontMono, fontSize: '0.72rem', letterSpacing: '0.1em', background: color.highlighter, color: color.highlighterInk, padding: '2px 6px', borderRadius: 3 },
    brandName: { fontFamily: fontMono, fontSize: '0.78rem', letterSpacing: '0.03em', color: color.inkSoft },
    headerRight: { display: 'flex', alignItems: 'center', gap: 10 },
    backBtn: { background: 'transparent', border: `1px solid ${color.border}`, color: color.ink, padding: '8px 14px', borderRadius: 4, fontSize: '0.82rem', fontFamily: fontBody, cursor: 'pointer' },
    logoutBtn: { background: 'transparent', border: `1px solid ${color.border}`, color: color.ink, padding: '8px 14px', borderRadius: 4, fontSize: '0.82rem', fontFamily: fontBody, cursor: 'pointer' },

    main: { padding: '32px 40px 60px', minHeight: 'calc(100vh - 60px)' },

    errorBox: { background: color.claySoft, color: color.clay, borderRadius: 4, padding: '14px 16px', marginBottom: 20 },

    toolbarRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    toolbarLabel: { fontFamily: fontMono, fontSize: '0.74rem', color: color.inkFaint },

    draftBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, background: color.card, border: `1px solid ${color.highlighter}66`, borderRadius: 6, padding: '14px 20px', marginBottom: 20 },
    draftSummary: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
    draftBadge: { fontFamily: fontMono, fontSize: '0.72rem', fontWeight: 600, padding: '4px 10px', borderRadius: 12 },
    badgePRESENT: { background: color.forestSoft, color: color.forest },
    badgeABSENT: { background: color.claySoft, color: color.clay },
    badgeLATE: { background: '#FDF6E0', color: '#8B7000' },
    badgeEXCUSED: { background: '#F0F0F2', color: color.inkSoft },
    finishBtn: { background: color.forest, color: color.paper, border: 'none', borderRadius: 4, padding: '9px 22px', fontSize: '0.85rem', fontWeight: 600, fontFamily: fontBody, cursor: 'pointer', whiteSpace: 'nowrap' },

    tableWrap: { border: `1px solid ${color.border}`, borderRadius: 4, overflowX: 'auto', overflowY: 'visible', background: color.card },
    table: { borderCollapse: 'collapse', fontSize: '0.87rem', minWidth: '100%' },

    thName: { textAlign: 'left', padding: '12px 16px', fontFamily: fontMono, fontSize: '0.66rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: color.inkFaint, borderBottom: `1px solid ${color.border}`, background: color.paper, whiteSpace: 'nowrap', position: 'sticky', left: 0, zIndex: 2 },
    thDate: { textAlign: 'center', padding: '10px 14px', fontFamily: fontMono, fontSize: '0.62rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: color.inkFaint, borderBottom: `1px solid ${color.border}`, background: color.paper, whiteSpace: 'nowrap', minWidth: 100 },
    thDateLabel: { display: 'block', fontSize: '0.82rem', fontWeight: 600, color: color.inkSoft, letterSpacing: '0.02em', textTransform: 'none' },
    thLessonLabel: { display: 'block', fontSize: '0.62rem', marginTop: 2, color: color.inkFaint },
    thDraft: { textAlign: 'center', padding: '10px 14px', fontFamily: fontMono, fontSize: '0.62rem', letterSpacing: '0.04em', textTransform: 'uppercase', color: color.inkFaint, borderBottom: `1px solid ${color.highlighter}`, background: `linear-gradient(180deg, #FFFDF0, ${color.paper})`, whiteSpace: 'nowrap', minWidth: 110 },

    tdName: { padding: '10px 16px', borderBottom: `1px solid ${color.paperLine}`, color: color.ink, fontWeight: 500, fontFamily: fontDisplay, fontSize: '0.92rem', whiteSpace: 'nowrap', position: 'sticky', left: 0, background: color.card, zIndex: 1 },
    tdRank: { display: 'inline-block', width: 20, fontFamily: fontMono, fontWeight: 700, fontSize: '0.78rem', color: color.accent, marginRight: 10 },
    tdCell: { textAlign: 'center', padding: '8px 12px', borderBottom: `1px solid ${color.paperLine}`, minWidth: 100 },
    cellBadge: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: '50%', fontFamily: fontMono, fontSize: '0.82rem', fontWeight: 700 },
    cellEmpty: { color: color.inkFaint, fontSize: '0.85rem' },
    cellSelect: { fontFamily: fontBody, fontSize: '0.82rem', padding: '6px 6px', border: `1.5px solid ${color.border}`, borderRadius: 4, background: color.card, color: color.ink, width: 96, textAlign: 'center', cursor: 'pointer' },

    emptyState: { background: color.card, border: `1px dashed ${color.border}`, borderRadius: 6, padding: '34px 26px', textAlign: 'center', marginTop: 24 },
    emptyTitle: { fontFamily: fontDisplay, fontSize: '1.1rem', fontWeight: 600, color: color.ink, margin: '0 0 6px' },
    emptySub: { color: color.inkSoft, fontSize: '0.9rem', margin: 0 },
}
