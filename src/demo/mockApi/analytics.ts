import { groupRoster } from '../mockData'
import { db, json } from './state'

export function handleAnalytics(path: string, method: string): Response | null {
    if (path.startsWith('/analytics/') && method === 'GET') {
        const category = path.slice('/analytics/'.length)
        switch (category) {
            case 'student':
                return json({
                    studentCount: db.students.length,
                    studentsAddedInMonth: 3,
                })
            case 'teacher':
                return json({
                    teacherCount: db.teachers.length,
                    teachersAddedInMonth: 1,
                })
            case 'lead':
                return json({
                    leadCount: db.leads.length,
                    leadCountInAMonth: 5,
                })
            case 'invoice': {
                const totalAmount = db.invoices.reduce((sum, inv) => sum + (inv.amount ?? 0), 0)
                return json({
                    invoiceAmount: totalAmount,
                    invoiceAmountInAMonth: 1050000,
                })
            }
            case 'enrollment':
                return json({
                    enrollmentCount: Object.values(groupRoster).reduce((sum, ids) => sum + ids.length, 0),
                    enrollmentCountInAMonth: 4,
                })
            case 'branch':
                return json({
                    branchCount: db.branches.length,
                })
            default:
                return json({ message: `Unknown analytics category: ${category}` }, 404)
        }
    }
    return null
}
