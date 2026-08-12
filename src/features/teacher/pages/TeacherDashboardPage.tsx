import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { formatTime } from '@/shared/lib'
import { Brand, Button, EmptyState, ErrorBox, Eyebrow, Panel, ThemeToggle } from '@/shared/ui'
import { GroupSwitcher } from '../components/GroupSwitcher'
import { LessonBanner } from '../components/LessonBanner'
import { RosterList } from '../components/RosterList'
import { StartLessonModal } from '../components/StartLessonModal'
import { StudentDetailModal } from '../components/StudentDetailModal'
import { useGroupInfo } from '../hooks/useGroupInfo'
import { useStartLesson } from '../hooks/useStartLesson'
import { useTeacherGroups } from '../hooks/useTeacherGroups'
import type { LessonDto, StudentDto } from '@/shared/types'

export function TeacherDashboardPage() {
    const session = useSession()
    const { signOut } = useAuth()
    const navigate = useNavigate()

    // Bo'sh satr = "hali tanlanmagan"; bunda birinchi guruh olinadi.
    // Alohida `useEffect` bilan sinxronlashdan ko'ra shu sodda va xatosizroq.
    const [pickedGroupId, setPickedGroupId] = useState('')
    const [activeLesson, setActiveLesson] = useState<LessonDto | null>(null)
    const [selectedStudent, setSelectedStudent] = useState<StudentDto | null>(null)
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)

    const groupsQuery = useTeacherGroups(session.token)
    const groups = groupsQuery.data ?? []
    const selectedGroupId = pickedGroupId || groups[0]?.id || ''

    const groupInfoQuery = useGroupInfo(session.token, selectedGroupId)
    const group = groupInfoQuery.data?.groupDto
    const students = groupInfoQuery.data?.studentDto ?? []

    const startLesson = useStartLesson(session.token, (lesson) => {
        setActiveLesson(lesson)
        setIsLessonModalOpen(false)
    })

    // Dashboard faqat shu o'qituvchining guruhlarini qaytaradi, shuning uchun
    // guruhning o'qituvchisi = kirgan foydalanuvchi.
    const teacherName = group?.teacher?.userDto?.fullName || 'Teacher'

    function openAttendance() {
        navigate('/attendance', { state: { students, activeLesson } })
    }

    function switchGroup(groupId: string) {
        setPickedGroupId(groupId)
        // Yangi guruhda oldingi dars bannerini ko'rsatish noto'g'ri bo'lardi.
        setActiveLesson(null)
    }

    const isLoading = groupsQuery.isLoading || groupInfoQuery.isLoading
    const loadError = groupsQuery.error ?? groupInfoQuery.error

    return (
        <div className="min-h-screen bg-surface">
            <header className="flex flex-col gap-2.5 border-b border-border-base bg-surface-card px-6 py-4 sm:px-10">
                <div className="flex flex-wrap items-center justify-between gap-3.5">
                    <Brand subtitle="Cornerstone · Teacher" />

                    <div className="flex flex-wrap items-center gap-2.5">
                        {group?.timeTable && (
                            <span className="rounded-full bg-accent-soft px-3.5 py-1.5 font-mono text-sm font-semibold whitespace-nowrap text-accent-fg">
                                {formatTime(group.timeTable.startTime)}–{formatTime(group.timeTable.endTime)}
                            </span>
                        )}
                        <ThemeToggle />
                        <Button variant="purple" size="sm" onClick={openAttendance}>
                            Attendance
                        </Button>
                        <Button
                            variant="brand"
                            size="sm"
                            disabled={!selectedGroupId}
                            onClick={() => setIsLessonModalOpen(true)}
                        >
                            ▶ Start Lesson
                        </Button>
                        <Button size="sm" onClick={signOut}>
                            Sign out
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg font-semibold text-fg">{teacherName}</span>
                    {groups.length > 0 && (
                        <>
                            <span className="text-fg-faint">·</span>
                            <GroupSwitcher
                                groups={groups}
                                selectedId={selectedGroupId}
                                onSelect={switchGroup}
                            />
                        </>
                    )}
                </div>
            </header>

            <main className="relative overflow-hidden bg-linear-to-b from-purple-soft/40 to-surface to-55% px-6 py-8 pb-16 sm:px-10">
                {/* Fondagi rangli dog'lar — faqat bezak */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-30 left-[5%] size-95 animate-float-slow rounded-full bg-purple opacity-20 blur-[70px]" />
                    <div className="absolute top-15 right-[8%] size-80 animate-float-slower rounded-full bg-accent opacity-15 blur-[70px]" />
                </div>

                <div className="relative z-1">
                    {isLoading && <p className="font-mono text-sm text-fg-faint">Loading your group…</p>}

                    {loadError && (
                        <div className="mb-5">
                            <ErrorBox>Couldn't load group info: {errorMessage(loadError)}</ErrorBox>
                        </div>
                    )}

                    {activeLesson && <LessonBanner lesson={activeLesson} onMarkAttendance={openAttendance} />}

                    {!isLoading && !loadError && group && (
                        <Panel>
                            <header className="mb-4">
                                <Eyebrow>Roster</Eyebrow>
                                <h2 className="mt-1 font-display text-xl font-semibold text-fg">
                                    Students ({students.length})
                                </h2>
                            </header>
                            <RosterList students={students} onSelect={setSelectedStudent} />
                        </Panel>
                    )}

                    {!isLoading && !loadError && !group && (
                        <EmptyState
                            title={
                                groups.length === 0
                                    ? "You don't have any groups yet."
                                    : 'No group selected right now.'
                            }
                            description={
                                groups.length === 0
                                    ? "Once you're assigned to a group, it'll show up here."
                                    : 'Pick a group from the dropdown above to view its roster.'
                            }
                        />
                    )}
                </div>
            </main>

            {isLessonModalOpen && (
                <StartLessonModal
                    groupName={group?.name}
                    isPending={startLesson.isPending}
                    error={startLesson.error}
                    onSubmit={(lessonName) => startLesson.mutate({ groupId: selectedGroupId, lessonName })}
                    onClose={() => setIsLessonModalOpen(false)}
                />
            )}

            {selectedStudent && (
                <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
            )}
        </div>
    )
}
