import { useT } from '@/shared/i18n'
import { Button, Modal } from '@/shared/ui'
import type { AdminRow } from '../types'

/**
 * Vaqtinchalik: o'quvchi biriktirish endpoint'i hali berilmagan.
 * Endpoint kelganda shu modal o'quvchi tanlagichga aylanadi.
 */
export function AssignStudentsModal({ group, onClose }: { group: AdminRow; onClose: () => void }) {
    const { t } = useT()

    return (
        <Modal
            eyebrow={t('admin.addStudents')}
            title={t('admin.assignTitle', { group: group.name ?? '' })}
            onClose={onClose}
            footer={<Button onClick={onClose}>{t('common.close')}</Button>}
        >
            <p className="text-sm leading-relaxed text-fg-muted">{t('admin.assignPending')}</p>
        </Modal>
    )
}
