import type { LeadCreateDto } from '@/shared/types'
import { LeadFormModal } from './LeadFormModal'

export interface NewLeadModalProps {
    token: string
    isPending?: boolean
    onClose: () => void
    onSubmit: (body: LeadCreateDto) => void
}

export function NewLeadModal({ token, isPending, onClose, onSubmit }: NewLeadModalProps) {
    return (
        <LeadFormModal
            token={token}
            isPending={isPending}
            onClose={onClose}
            onSubmit={(data) => onSubmit(data as LeadCreateDto)}
        />
    )
}
