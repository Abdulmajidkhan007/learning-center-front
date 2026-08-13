import { useT } from '@/shared/i18n'
import { Avatar, Button, Modal } from '@/shared/ui'
import type { TranslationKey } from '@/shared/i18n'
import type { StudentDto } from '@/shared/types'

const ROWS: { labelKey: TranslationKey; get: (student: StudentDto) => string | undefined }[] = [
    { labelKey: 'field.phone', get: (student) => student.userDto?.phone },
    { labelKey: 'field.birthDate', get: (student) => student.userDto?.birthDate },
    { labelKey: 'field.parentPhone', get: (student) => student.parentPhone },
]

export function StudentDetailModal({ student, onClose }: { student: StudentDto; onClose: () => void }) {
    const { t } = useT()

    return (
        <Modal
            title={
                <span className="flex items-center gap-3">
                    <Avatar name={student.userDto?.fullName} src={student.userDto?.imageUrl} size="lg" />
                    <span className="min-w-0 truncate">{student.userDto?.fullName || '—'}</span>
                </span>
            }
            onClose={onClose}
            footer={<Button onClick={onClose}>{t('common.close')}</Button>}
        >
            <dl>
                {ROWS.map((row) => (
                    <div
                        key={row.labelKey}
                        className="flex items-center justify-between gap-3 border-b border-border-base py-2.5 text-sm"
                    >
                        <dt className="font-mono text-[0.68rem] tracking-[0.06em] text-fg-faint uppercase">
                            {t(row.labelKey)}
                        </dt>
                        <dd className="truncate text-fg">{row.get(student) || '—'}</dd>
                    </div>
                ))}
            </dl>
        </Modal>
    )
}
