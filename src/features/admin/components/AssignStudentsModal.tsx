import { useMemo, useState } from 'react'
import { useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Input, Modal } from '@/shared/ui'
import { useEntityList } from '../hooks/useEntityList'
import { useAddEnrollment, useGroupEnrollments } from '../hooks/useGroupEnrollments'
import { entityByKey } from '../config/entities'
import type { AdminRow } from '../types'

/**
 * Guruhga o'quvchi biriktirish.
 *
 * Backendda guruh ichida ro'yxat yo'q — `enrollment` ko'prigi orqali
 * bog'lanadi (`api/enrollmentApi.ts` ga qarang).
 *
 * O'chirish (guruhdan chiqarish) hozircha yo'q: `DELETE /enrollments/{id}`
 * enrollment id sini talab qiladi, `EnrollmentDto` esa uni qaytarmaydi.
 */
export function AssignStudentsModal({ group, onClose }: { group: AdminRow; onClose: () => void }) {
    const { t } = useT()
    const session = useSession()
    const [search, setSearch] = useState('')

    const students = useEntityList(entityByKey('students'), session.token, { page: 0, search })
    const enrollments = useGroupEnrollments(session.token, group.id)
    const add = useAddEnrollment(session.token, group.id)

    const enrolledIds = useMemo(
        () => new Set((enrollments.data ?? []).map((item) => item.studentId)),
        [enrollments.data]
    )

    const failure = students.error ?? enrollments.error ?? add.error

    return (
        <Modal
            eyebrow={t('admin.addStudents')}
            title={t('admin.assignTitle', { group: group.name ?? '' })}
            onClose={onClose}
            footer={<Button onClick={onClose}>{t('common.close')}</Button>}
        >
            <div className="flex flex-col gap-3">
                <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t('admin.search', { entity: t('entity.students.plural').toLowerCase() })}
                />

                {failure != null && <ErrorBox>{errorMessage(failure)}</ErrorBox>}

                {students.isLoading && <p className="text-sm text-fg-faint">{t('common.loading')}</p>}

                <ul className="flex max-h-72 flex-col overflow-y-auto">
                    {students.rows.map((student) => {
                        const isEnrolled = enrolledIds.has(student.id)
                        return (
                            <li
                                key={student.id}
                                className="flex items-center justify-between gap-3 border-b border-border-base py-2.5 last:border-b-0"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-fg">
                                        {student.userDto?.fullName || '—'}
                                    </p>
                                    <p className="truncate font-mono text-xs text-fg-faint">
                                        {student.userDto?.phone || '—'}
                                    </p>
                                </div>

                                {isEnrolled ? (
                                    <span className="shrink-0 text-sm text-success-fg">
                                        ✓ {t('admin.alreadyInGroup')}
                                    </span>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        disabled={add.isPending}
                                        onClick={() => add.mutate(student.id)}
                                    >
                                        {t('admin.addToGroup')}
                                    </Button>
                                )}
                            </li>
                        )
                    })}

                    {!students.isLoading && students.rows.length === 0 && (
                        <li className="py-4 text-center text-sm text-fg-faint">
                            {t('admin.notFound', { entity: t('entity.students.plural').toLowerCase() })}
                        </li>
                    )}
                </ul>

                <p className="text-[0.72rem] leading-snug text-fg-faint">{t('admin.removeNotAvailable')}</p>
            </div>
        </Modal>
    )
}
