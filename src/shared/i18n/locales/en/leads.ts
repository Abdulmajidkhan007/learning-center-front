import type { LeadsKeys } from '../uz/leads'

/** Lidlar bo'limi. (inglizcha) */
export const leads: Record<LeadsKeys, string> = {
    'lead.title': 'Leads',
    'lead.eyebrow': 'Potential students',
    'lead.fullName': 'Full name',
    'lead.phone': 'Phone',
    'lead.callAt': 'Call time',
    'lead.source': 'Source',
    'lead.source.INSTAGRAM': 'Instagram',
    'lead.source.FACEBOOK': 'Facebook',
    'lead.source.TELEGRAM': 'Telegram',
    'lead.preferredCourse': 'Preferred course',
    'lead.new': '+ New lead',
    'lead.newTitle': 'New lead',
    'lead.changeStatus': 'Change status',
    'lead.search': 'name or phone…',
    'lead.allStatuses': 'All statuses',
    'lead.empty': 'No leads found',
    'lead.loadFailed': 'Could not load leads: {{message}}',
    'lead.deleteConfirm': 'Delete {{name}}? This cannot be undone.',
    'lead.status.NEW': 'New',
    'lead.status.CONFIRMED': 'Confirmed',
    'lead.status.REJECTED': 'Rejected',
    'lead.status.CALL_LATER': 'Call later',
}
