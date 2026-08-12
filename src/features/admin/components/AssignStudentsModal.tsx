import { Button, Modal } from '@/shared/ui'
import type { AdminRow } from '../types'

/**
 * Vaqtinchalik: o'quvchi biriktirish endpoint'i hali berilmagan.
 * Endpoint kelganda shu modal o'quvchi tanlagichga aylanadi.
 */
export function AssignStudentsModal({ group, onClose }: { group: AdminRow; onClose: () => void }) {
    return (
        <Modal
            eyebrow="Assign students"
            title={`Add students to ${group.name ?? ''}`}
            onClose={onClose}
            footer={<Button onClick={onClose}>Close</Button>}
        >
            <p className="text-sm leading-relaxed text-fg-muted">
                Student assignment isn't wired up yet — once the endpoint is shared, this will become a
                picker for adding students to this group.
            </p>
        </Modal>
    )
}
