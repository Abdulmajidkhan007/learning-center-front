import { Avatar, Button, Modal } from '@/shared/ui'
import type { StudentDto } from '@/shared/types'

const ROWS = [
    { label: 'Phone', get: (student: StudentDto) => student.userDto?.phone },
    { label: 'Birth date', get: (student: StudentDto) => student.userDto?.birthDate },
    { label: 'Parent phone', get: (student: StudentDto) => student.parentPhone },
]

export function StudentDetailModal({ student, onClose }: { student: StudentDto; onClose: () => void }) {
    return (
        <Modal
            title={
                <span className="flex items-center gap-3.5">
                    <Avatar name={student.userDto?.fullName} src={student.userDto?.imgUrl} size="lg" />
                    {student.userDto?.fullName || '—'}
                </span>
            }
            onClose={onClose}
            footer={<Button onClick={onClose}>Close</Button>}
        >
            <dl>
                {ROWS.map((row) => (
                    <div
                        key={row.label}
                        className="flex items-center justify-between border-b border-border-base py-2.5 text-sm"
                    >
                        <dt className="font-mono text-[0.68rem] tracking-[0.06em] text-fg-faint uppercase">
                            {row.label}
                        </dt>
                        <dd className="text-fg">{row.get(student) || '—'}</dd>
                    </div>
                ))}
            </dl>
        </Modal>
    )
}
