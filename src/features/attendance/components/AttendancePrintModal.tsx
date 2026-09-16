import { useMemo } from 'react'
import { useSession } from '@/app/providers/useAuth'
import { useMyOrganization } from '@/shared/hooks'
import { useT } from '@/shared/i18n'
import { formatDate } from '@/shared/lib'
import { Button, Modal, type PastLessonColumn } from '@/shared/ui'
import type { AttendanceDraft } from '../hooks/useAttendanceDraft'
import type { StudentDto } from '@/shared/types'
import { PrintIcon } from './PrintIcon'

export interface AttendancePrintModalProps {
    students: StudentDto[]
    pastColumns: PastLessonColumn[]
    draft?: AttendanceDraft | null
    groupName?: string
    monthLabel: string
    onClose: () => void
}

interface PrintColumn {
    id: string
    header: string
    getSymbol: (studentId: string) => string
}

/**
 * Davomat jurnalini chop etish (A4 landscape) modali.
 *
 * O'quvchilar ro'yxati va dars sanalarini jadval ko'rinishida chiqaradi.
 * Bosma versiyada qora-oq ranglar va tushunarli belgilar (+, −, S) qo'llaniladi.
 */
export function AttendancePrintModal({
    students,
    pastColumns,
    draft,
    groupName = '—',
    monthLabel,
    onClose,
}: AttendancePrintModalProps) {
    const { t } = useT()
    const session = useSession()
    const { data: organization } = useMyOrganization(
        session.token,
        session.claims?.organizationId as string | undefined
    )

    const centerName = organization?.name || t('attendance.centerName')

    const columns = useMemo<PrintColumn[]>(() => {
        const result: PrintColumn[] = []

        const editingPastLessonId =
            draft && pastColumns.some((col) => col.lessonId === draft.lesson.id)
                ? draft.lesson.id
                : null

        pastColumns.forEach((col) => {
            const isEditingThisCol = col.lessonId === editingPastLessonId
            const header = col.date
                ? col.lessonTitle
                    ? `${formatDate(col.date)} (${col.lessonTitle})`
                    : formatDate(col.date)
                : col.lessonTitle || ''

            result.push({
                id: col.lessonId,
                header,
                getSymbol: (studentId: string) => {
                    const status = isEditingThisCol && draft
                        ? (draft.statuses[studentId] ?? 'PRESENT')
                        : col.attendanceMap[studentId]?.status

                    if (status === 'PRESENT') return t('attendance.presentSymbol')
                    if (status === 'ABSENT') return t('attendance.absentSymbol')
                    if (status === 'EXCUSED') return t('attendance.excusedSymbol')
                    return ''
                },
            })
        })

        if (draft && !editingPastLessonId) {
            const draftHeader = draft.lesson.lessonDate
                ? `${formatDate(draft.lesson.lessonDate)} (${t('attendance.lessonNumber', { number: draft.lesson.title ?? '' })})`
                : t('attendance.lessonNumber', { number: draft.lesson.title ?? '' })

            result.push({
                id: draft.lesson.id,
                header: draftHeader,
                getSymbol: (studentId: string) => {
                    const status = draft.statuses[studentId] ?? 'PRESENT'
                    if (status === 'PRESENT') return t('attendance.presentSymbol')
                    if (status === 'ABSENT') return t('attendance.absentSymbol')
                    if (status === 'EXCUSED') return t('attendance.excusedSymbol')
                    return ''
                },
            })
        }

        return result
    }, [pastColumns, draft, t])

    function handlePrint() {
        window.print()
    }

    return (
        <Modal
            eyebrow={t('attendance.title')}
            title={t('attendance.journalTitle')}
            onClose={onClose}
            maxWidth="max-w-4xl"
        >
            <style>{`
                @media print {
                    body * {
                        visibility: hidden !important;
                    }
                    #attendance-journal-print-area, #attendance-journal-print-area * {
                        visibility: visible !important;
                    }
                    #attendance-journal-print-area {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        padding: 10mm !important;
                        margin: 0 !important;
                        background: #ffffff !important;
                        color: #000000 !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    #attendance-journal-print-area table,
                    #attendance-journal-print-area th,
                    #attendance-journal-print-area td {
                        border-color: #000000 !important;
                        color: #000000 !important;
                        background: #ffffff !important;
                    }
                    @page {
                        size: A4 landscape;
                        margin: 10mm;
                    }
                }
            `}</style>

            <div
                id="attendance-journal-print-area"
                className="my-2 rounded-lg border border-border-base bg-surface-card p-5 shadow-sm text-fg overflow-x-auto"
            >
                {/* Jurnal sarlavhasi */}
                <div className="border-b border-border-base pb-3 mb-4 text-center">
                    <p className="text-xs font-semibold tracking-wider text-fg-muted uppercase">
                        {centerName}
                    </p>
                    <h3 className="text-xl font-bold font-display text-fg mt-0.5">
                        {t('attendance.journalTitle').toUpperCase()}
                    </h3>
                    <div className="mt-2 flex flex-wrap justify-center gap-6 text-sm">
                        <p>
                            <span className="font-medium text-fg-muted">{t('attendance.groupLabel')}:</span>{' '}
                            <span className="font-semibold text-fg">{groupName}</span>
                        </p>
                        <p>
                            <span className="font-medium text-fg-muted">{t('attendance.monthLabel')}:</span>{' '}
                            <span className="font-semibold text-fg">{monthLabel}</span>
                        </p>
                    </div>
                </div>

                {/* Legend / Belgilar izohi */}
                <p className="mb-3 text-xs text-fg-muted italic">
                    {t('attendance.legend')}
                </p>

                {/* Davomat jadvali */}
                <table className="w-full border-collapse border border-border-base text-xs">
                    <thead>
                        <tr className="bg-surface-soft border-b border-border-base">
                            <th className="border border-border-base px-2 py-1.5 text-center font-medium w-8">
                                #
                            </th>
                            <th className="border border-border-base px-3 py-1.5 text-left font-medium min-w-[160px]">
                                {t('attendance.student')}
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    className="border border-border-base px-2 py-1.5 text-center font-medium min-w-[60px]"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={student.id} className="border-b border-border-base/60">
                                <td className="border border-border-base px-2 py-1.5 text-center text-fg-muted">
                                    {index + 1}
                                </td>
                                <td className="border border-border-base px-3 py-1.5 font-medium text-fg">
                                    {student.userDto?.fullName || '—'}
                                </td>
                                {columns.map((col) => {
                                    const symbol = col.getSymbol(student.id)
                                    return (
                                        <td
                                            key={col.id}
                                            className="border border-border-base px-2 py-1.5 text-center font-bold text-sm"
                                        >
                                            {symbol}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Imzo joyi */}
                <div className="mt-8 pt-4 flex justify-end text-sm">
                    <p className="font-medium">
                        {t('attendance.teacherSignature')}: <span className="inline-block border-b border-current w-48 ml-2"></span>
                    </p>
                </div>
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
                <Button onClick={onClose}>{t('common.close')}</Button>
                <Button variant="primary" onClick={handlePrint} className="gap-1.5">
                    <PrintIcon />
                    {t('common.print')}
                </Button>
            </div>
        </Modal>
    )
}
