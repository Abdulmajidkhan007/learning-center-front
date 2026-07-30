import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

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
const ATTENDANCE_ENDPOINT = '/api/v1/attendance'

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

function formatTime(t) {
    // LocalTime serializes as "HH:mm:ss" — nobody needs the seconds.
    return t ? t.slice(0, 5) : ''
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
    const navigate = useNavigate()

    // Load the teacher's own groups for the dropdown, once.
    useEffect(() => {
        authFetch(`${GROUP_ENDPOINT}/groups`, session.token)
            .then((list) => {
                const groups = list || []
                setGroupOptions(groups)
                // Default to the first group if none is selected yet
                if (groups.length > 0) {
                    loadGroupInfo(groups[0].id)
                } else {
                    setLoading(false)
                }
            })
            .catch(() => {
                setGroupOptions([])
                setLoading(false)
            })
    }, [session.token])

    const loadGroupInfo = useCallback(
        async (groupId) => {
            setLoading(true)
            setLoadError('')
            try {
                const data = await authFetch(`${GROUP_ENDPOINT}/groupInfo?groupId=${encodeURIComponent(groupId)}`, session.token)
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

    function switchGroup(id) {
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
    // Every group returned by this dashboard belongs to the logged-in
    // teacher, so group.teacher.userDto.fullName IS the teacher's own name —
    // far more reliable than guessing at JWT claim keys.
    const teacherName = group?.teacher?.userDto?.fullName || 'Teacher'
    const students = groupInfo?.studentDto || []

    return (
        <div style={s.page}>
            <style>{`
                .tch-btn { transition: background 0.15s ease, opacity 0.15s ease, transform 0.1s ease; cursor: pointer; }
                .tch-btn:hover { opacity: 0.88; }
                .tch-btn:active { transform: translateY(1px); }
                .tch-select { transition: border-color 0.15s ease; cursor: pointer; }
                .tch-select:hover { border-color: #b7ab8a; }
                .tch-row:hover { background: #f4efe3; border-radius: 6px; margin: 0 -8px; padding-left: 12px; padding-right: 12px; }
                .tch-group-switcher { position: relative; cursor: pointer; display: inline-block; }
                .tch-group-dropdown { display: none; }
                .tch-group-switcher:hover .tch-group-dropdown { display: block; }
                .tch-dropdown-item { transition: background 0.12s ease; text-align: left; width: 100%; cursor: pointer; }
                .tch-dropdown-item:hover { background: #f4efe3; }
                .tch-input { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
                .tch-input:focus {
                    outline: none;
                    border-color: #1f2a3d;
                    box-shadow: 0 0 0 3px rgba(31,42,61,0.08);
                }
            `}</style>

            <header style={s.header}>
                <div style={s.headerTopRow}>
                    <div style={s.brand}>
                        <span style={s.mark}>CLC</span>
                        <span style={s.brandName}>Cornerstone · Teacher</span>
                    </div>

                    <div style={s.headerRight}>
                        {group?.timeTable && (
                            <span style={s.timePill}>
                                {formatTime(group.timeTable.startTime)}–{formatTime(group.timeTable.endTime)}
                            </span>
                        )}
                        <button
                            className="tch-btn"
                            style={s.attendanceHeaderBtn}
                            onClick={() => navigate('/attendance', { state: { session, students, activeLesson } })}
                        >
                            Attendance
                        </button>
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
                </div>

                <div style={s.headerSubRow}>
                    <span style={s.teacherName}>{teacherName}</span>

                    {group && (
                        <>
                            <span style={s.headerSep}>·</span>
                            <div className="tch-group-switcher" style={s.groupSwitcher}>
                                <span style={s.groupSwitcherLabel}>
                                    {group.name}
                                    <span style={s.caret}> ▾</span>
                                </span>

                                <div className="tch-group-dropdown" style={s.groupDropdown}>
                                    <div style={s.groupDropdownHeading}>Switch group</div>
                                    {groupOptions.map((g) => (
                                        <button
                                            key={g.id}
                                            className="tch-dropdown-item"
                                            style={{
                                                ...s.groupDropdownItem,
                                                ...(g.id === selectedGroupId ? s.groupDropdownItemActive : {}),
                                            }}
                                            onClick={() => switchGroup(g.id)}
                                        >
                                            <span style={s.dropdownCheck}>
                                                {g.id === selectedGroupId ? '✓' : ''}
                                            </span>
                                            {g.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
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
                        <div style={s.lessonBannerContent}>
                            <div style={s.lessonBannerTitle}>
                                Lesson {activeLesson.lessonNumber} started
                            </div>
                            <div style={s.lessonBannerSub}>
                                {activeLesson.lessonDate}
                            </div>
                        </div>
                        <button style={s.markAttendanceBtn} onClick={() => navigate('/attendance', { state: { session, students, activeLesson } })}>
                            Mark Attendance
                        </button>
                    </div>
                )}

                {!loading && !loadError && group && !activeLesson && (
                    <>
                        <div style={s.panel}>
                            <header style={s.panelHeader}>
                                <span style={s.eyebrow}>Roster</span>
                                <h2 style={s.panelTitle}>Students ({students.length})</h2>
                            </header>

                            <div style={s.rosterList}>
                                {students.length === 0 && (
                                    <p style={s.tdEmpty}>No students in this group yet.</p>
                                )}
                                {students.map((st, i) => (
                                    <div key={st.id} className="tch-row" style={s.rosterItem}>
                                        <span style={s.rosterRank}>{i + 1}</span>
                                        {st.userDto?.imgUrl ? (
                                            <img
                                                src={st.userDto.imgUrl}
                                                alt=""
                                                style={s.rosterAvatarImg}
                                            />
                                        ) : (
                                            <div style={s.rosterAvatarFallback}>
                                                {initials(st.userDto?.fullName)}
                                            </div>
                                        )}
                                        <div style={s.rosterInfo}>
                                            <div style={s.rosterName}>{st.userDto?.fullName || '—'}</div>
                                            <div style={s.rosterMeta}>
                                                <span>{st.userDto?.phone || '—'}</span>
                                                <span style={s.rosterDot}>·</span>
                                                <span>{st.userDto?.birthDate || '—'}</span>
                                            </div>
                                        </div>
                                        <div style={s.rosterParent}>
                                            <span style={s.eyebrowSmall}>Parent</span>
                                            <div>{st.parentPhone || '—'}</div>
                                        </div>
                                    </div>
                                ))}
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
    accent: '#4C5FD5', accentSoft: '#EAECFB',
    purple: '#8B5CF6', purpleSoft: '#F1EBFD', magenta: '#C244B0',
}
const fontDisplay = "'Fraunces', ui-serif, Georgia, serif"
const fontBody = "'Work Sans', ui-sans-serif, system-ui, sans-serif"
const fontMono = "'IBM Plex Mono', ui-monospace, monospace"

const s = {
    page: { minHeight: '100vh', background: color.paper, fontFamily: fontBody },

    header: { display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 40px', borderBottom: `1px solid ${color.border}`, background: color.card },
    headerTopRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 },
    brand: { display: 'flex', alignItems: 'center', gap: 8 },
    mark: { fontFamily: fontMono, fontSize: '0.72rem', letterSpacing: '0.1em', background: color.highlighter, color: color.highlighterInk, padding: '2px 6px', borderRadius: 3 },
    brandName: { fontFamily: fontMono, fontSize: '0.78rem', letterSpacing: '0.03em', color: color.inkSoft },
    headerRight: { display: 'flex', alignItems: 'center', gap: 10 },
    startBtn: { background: color.highlighter, color: color.highlighterInk, border: 'none', borderRadius: 4, padding: '10px 18px', fontSize: '0.9rem', fontWeight: 600, fontFamily: fontBody },
    attendanceHeaderBtn: { background: color.purple, color: color.paper, border: 'none', borderRadius: 4, padding: '10px 16px', fontSize: '0.85rem', fontWeight: 500, fontFamily: fontBody },
    logoutBtn: { background: 'transparent', border: `1px solid ${color.border}`, color: color.ink, padding: '9px 14px', borderRadius: 4, fontSize: '0.85rem', fontFamily: fontBody },

    headerSubRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    teacherName: { fontFamily: fontDisplay, fontSize: '1.05rem', fontWeight: 600, color: color.ink },
    headerSep: { color: color.inkFaint },

    groupSwitcher: { position: 'relative', cursor: 'pointer' },
    groupSwitcherLabel: { fontFamily: fontDisplay, fontSize: '1.05rem', fontWeight: 600, color: color.purple },
    caret: { fontSize: '0.75rem' },

    groupDropdown: { position: 'absolute', top: '100%', left: 0, marginTop: 8, background: color.card, border: `1px solid ${color.purple}44`, borderRadius: 8, boxShadow: `0 16px 40px -14px rgba(139,92,246,0.35)`, minWidth: 170, padding: 6, zIndex: 20 },
    groupDropdownHeading: { fontFamily: fontMono, fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: color.inkFaint, padding: '4px 10px 6px' },
    groupDropdownItem: { display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'none', border: 'none', padding: '8px 10px', borderRadius: 5, fontSize: '0.88rem', color: color.ink, fontFamily: fontBody },
    groupDropdownItemActive: { background: color.purpleSoft, color: color.purple, fontWeight: 600 },
    dropdownCheck: { width: 14, color: color.purple, fontSize: '0.8rem', flexShrink: 0 },

    timePill: { fontFamily: fontMono, fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.02em', background: color.accentSoft, color: color.accent, padding: '7px 14px', borderRadius: 20, whiteSpace: 'nowrap' },

    main: {
        position: 'relative',
        padding: '32px 40px 60px',
        background: `linear-gradient(180deg, ${color.purpleSoft}55, ${color.paper} 55%)`,
        minHeight: 'calc(100vh - 90px)',
        overflow: 'hidden',
    },
    mainContent: { position: 'relative', zIndex: 1 },
    blob: { position: 'absolute', borderRadius: '50%', filter: 'blur(70px)', zIndex: 0, pointerEvents: 'none' },
    blob1: { width: 380, height: 380, top: -120, left: '5%', background: color.purple, opacity: 0.22, animation: 'tchFloat1 16s ease-in-out infinite alternate' },
    blob2: { width: 320, height: 320, top: 60, right: '8%', background: color.accent, opacity: 0.18, animation: 'tchFloat2 20s ease-in-out infinite alternate' },
    blob3: { width: 300, height: 300, bottom: -140, left: '35%', background: color.magenta, opacity: 0.15, animation: 'tchFloat1 18s ease-in-out infinite alternate-reverse' },

    status: { color: color.inkFaint, fontFamily: fontMono, fontSize: '0.85rem' },
    errorBox: { background: color.claySoft, color: color.clay, borderRadius: 4, padding: '14px 16px', marginBottom: 20 },

    lessonBanner: { display: 'flex', alignItems: 'center', gap: 16, background: color.forestSoft, border: `1px solid ${color.forest}33`, borderRadius: 6, padding: '16px 20px', marginBottom: 24 },
    lessonBannerContent: { flex: 1 },
    markAttendanceBtn: { background: color.forest, color: color.paper, border: 'none', borderRadius: 4, padding: '10px 20px', fontSize: '0.85rem', fontWeight: 600, fontFamily: fontBody, cursor: 'pointer', whiteSpace: 'nowrap' },
    stamp: { display: 'inline-flex', flexShrink: 0, fontFamily: fontMono, fontSize: '0.65rem', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '3px 8px', border: `1.5px solid ${color.forest}`, borderRadius: 3, color: color.forest, transform: 'rotate(-2deg)' },
    lessonBannerTitle: { fontFamily: fontDisplay, fontWeight: 600, fontSize: '1.05rem', color: color.ink },
    lessonBannerSub: { fontSize: '0.85rem', color: color.inkSoft, marginTop: 2 },

    eyebrow: { fontFamily: fontMono, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: color.inkFaint, display: 'block' },
    eyebrowSmall: { fontFamily: fontMono, fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: color.inkFaint },

    panel: { background: color.card, border: `1px solid ${color.border}`, borderRadius: 6, padding: '24px 26px 20px', boxShadow: `0 1px 0 ${color.border}, 0 10px 30px -18px rgba(31,42,61,0.3)` },
    panelHeader: { marginBottom: 16 },
    panelTitle: { fontFamily: fontDisplay, fontSize: '1.3rem', fontWeight: 600, color: color.ink, margin: '4px 0 0' },

    rosterList: { display: 'flex', flexDirection: 'column' },
    rosterItem: { display: 'flex', alignItems: 'center', gap: 16, padding: '14px 4px', borderBottom: `1px solid ${color.paperLine}` },
    rosterRank: { width: 22, flexShrink: 0, textAlign: 'center', fontFamily: fontMono, fontWeight: 700, fontSize: '0.85rem', color: color.accent },
    rosterAvatarImg: { width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${color.paper}`, boxShadow: `0 0 0 1px ${color.border}` },
    rosterAvatarFallback: { width: 52, height: 52, borderRadius: '50%', background: color.highlighter, color: color.highlighterInk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fontDisplay, fontWeight: 700, fontSize: '1.05rem', flexShrink: 0, border: `2px solid ${color.paper}`, boxShadow: `0 0 0 1px ${color.border}` },
    rosterInfo: { flex: 1, minWidth: 0 },
    rosterName: { fontFamily: fontDisplay, fontSize: '1.02rem', fontWeight: 600, color: color.ink },
    rosterMeta: { display: 'flex', gap: 6, fontSize: '0.83rem', color: color.inkSoft, marginTop: 2 },
    rosterDot: { color: color.inkFaint },
    rosterParent: { textAlign: 'right', flexShrink: 0 },
    tdEmpty: { padding: '26px 16px', textAlign: 'center', color: color.inkFaint },

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