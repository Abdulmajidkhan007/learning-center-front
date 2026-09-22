import { db, json, nextId, noContent, page, type Row } from './state'
import type { PlanDto, SubscriptionDto } from '@/shared/types'

/**
 * Dasturchi paneli uchun mock: tariflar va obunalar.
 *
 * Demo bitta markazni ko'rsatadi, lekin bu ekran hamma markazlar ustidan
 * turadi — shuning uchun bu yerda bir nechta tashkilot ko'rinadi.
 */
export function handleSubscriptions(
    path: string,
    method: string,
    url: URL,
    body: Record<string, unknown>
): Response | null {
    // Markazning o'z obunasi. Demo'da muddat ataylab yaqin qilingan —
    // ogohlantirish qanday ko'rinishini ko'rsatish uchun.
    if (path === '/subscriptions/my' && method === 'GET') {
        const expires = new Date()
        expires.setDate(expires.getDate() + 5)
        return json({
            id: 'sb-my',
            organization: { id: db.organizations[0]?.id ?? '', name: db.organizations[0]?.name ?? '' },
            plan: { id: 'pl-2', name: 'Standard' },
            status: 'ACTIVE',
            startsAt: new Date().toISOString(),
            expiresAt: expires.toISOString(),
            paidAmount: 450000,
            currency: 'UZS',
        })
    }

    // Dasturchi paneli tashkilot ham ochadi — demo'da ro'yxat super-admin
    // bilan bir xil manbadan keladi.
    if (path === '/developer/create-super-admin' && method === 'POST') {
        return json({ id: nextId('u'), ...body, role: 'SUPER_ADMIN' }, 201)
    }

    if (path === '/plans' && method === 'GET') {
        return page(db.plans as unknown as Row[], url)
    }
    if (path === '/plans' && method === 'POST') {
        const plan = { id: nextId('pl'), active: true, ...body } as PlanDto
        db.plans = [...db.plans, plan]
        return json(plan, 201)
    }
    if (path.startsWith('/plans/') && method === 'PUT') {
        const id = path.split('/')[2]
        db.plans = db.plans.map((plan) => (plan.id === id ? ({ ...plan, ...body } as PlanDto) : plan))
        return json(db.plans.find((plan) => plan.id === id))
    }
    if (path.startsWith('/plans/') && method === 'DELETE') {
        const id = path.split('/')[2]
        db.plans = db.plans.filter((plan) => plan.id !== id)
        return noContent()
    }

    if (path === '/subscriptions' && method === 'GET') {
        const search = (url.searchParams.get('search') ?? '').toLowerCase()
        const rows = search
            ? db.subscriptions.filter((row) =>
                  (row.organization?.name ?? '').toLowerCase().includes(search)
              )
            : db.subscriptions
        return page(rows as unknown as Row[], url)
    }
    if (path === '/subscriptions' && method === 'POST') {
        const plan = db.plans.find((row) => row.id === body.planId)
        const organization = db.organizations.find((row) => row.id === body.organizationId)
        const starts = new Date()
        const expires = new Date(starts)
        expires.setMonth(expires.getMonth() + (plan?.durationMonths ?? 1))

        const subscription: SubscriptionDto = {
            id: nextId('sb'),
            organization: { id: organization?.id ?? '', name: organization?.name ?? '' },
            plan: { id: plan?.id ?? '', name: plan?.name ?? '' },
            status: 'ACTIVE',
            startsAt: starts.toISOString(),
            expiresAt: expires.toISOString(),
            paidAmount: plan?.price,
            currency: plan?.currency,
            note: typeof body.note === 'string' ? body.note : undefined,
        }
        db.subscriptions = [subscription, ...db.subscriptions]
        return json(subscription, 201)
    }
    if (path.startsWith('/subscriptions/') && method === 'PUT') {
        const id = path.split('/')[2]
        db.subscriptions = db.subscriptions.map((row) =>
            row.id === id ? ({ ...row, ...body } as SubscriptionDto) : row
        )
        return json(db.subscriptions.find((row) => row.id === id))
    }

    return null
}
