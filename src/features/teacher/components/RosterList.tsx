import { Avatar } from '@/shared/ui'
import type { StudentDto } from '@/shared/types'

interface RosterListProps {
    students: StudentDto[]
    onSelect: (student: StudentDto) => void
}

/** Guruh ro'yxati. Har bir qator bosiladi — o'quvchi kartasini ochadi. */
export function RosterList({ students, onSelect }: RosterListProps) {
    if (students.length === 0) {
        return <p className="py-6 text-center text-fg-faint">No students in this group yet.</p>
    }

    return (
        <ul className="flex flex-col">
            {students.map((student, index) => (
                <li key={student.id}>
                    <button
                        type="button"
                        onClick={() => onSelect(student)}
                        className="flex w-full cursor-pointer items-center gap-4 border-b border-border-base px-1 py-3.5 text-left transition-colors hover:bg-surface-hover"
                    >
                        <span className="w-5.5 shrink-0 text-center font-mono text-sm font-bold text-accent-fg">
                            {index + 1}
                        </span>
                        <Avatar name={student.userDto?.fullName} src={student.userDto?.imageUrl} />
                        <span className="font-display text-base font-semibold text-fg">
                            {student.userDto?.fullName || '—'}
                        </span>
                    </button>
                </li>
            ))}
        </ul>
    )
}
