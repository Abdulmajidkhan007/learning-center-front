import { useMemo, useState } from 'react'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import {
    AppShell,
    Button,
    ErrorBox,
    Eyebrow,
    Input,
    Pagination,
    Panel,
    SegmentedControl,
} from '@/shared/ui'
import { AnalyticsStatsRow } from '../components/AnalyticsStatsRow'
import { BranchFormModal } from '../components/BranchFormModal'
import { OrganizationFormModal } from '../components/OrganizationFormModal'
import { SimpleTable, type SimpleColumn } from '../components/SimpleTable'
import { useAnalytics } from '../hooks/useAnalytics'
import {
    useBranchMutations,
    useBranches,
    useOrganizationMutations,
    useOrganizations,
} from '../hooks/useSuperAdminData'
import type { BranchDto, OrganizationDto } from '@/shared/types'

type Tab = 'organizations' | 'branches'

/**
 * Super-admin paneli: tashkilotlar va filiallar.
 *
 * Ikkala ro'yxat ham bir vaqtda yuklanadi — filial formasidagi tashkilot
 * tanlagichi baribir tashkilotlar ro'yxatini talab qiladi, ya'ni tab
 * almashganda kutish kerak bo'lmaydi.
 */
export function SuperAdminDashboardPage() {
    const { t } = useT()
    const session = useSession()
    const { signOut } = useAuth()

    const [tab, setTab] = useState<Tab>('organizations')
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [orgForm, setOrgForm] = useState<{ value: OrganizationDto | null } | null>(null)
    const [branchForm, setBranchForm] = useState<{ value: BranchDto | null } | null>(null)

    const organizations = useOrganizations(session.token, tab === 'organizations' ? page : 0, search)
    const branches = useBranches(session.token, tab === 'branches' ? page : 0, search)
    const saveOrganization = useOrganizationMutations(session.token)
    const branchMutations = useBranchMutations(session.token)

    const analytics = useAnalytics(session.token)

    const organizationOptions = useMemo(
        () => organizations.rows.map((org) => ({ value: org.id, label: org.name || org.id })),
        [organizations.rows]
    )

    const list = tab === 'organizations' ? organizations : branches

    function changeTab(next: Tab) {
        setTab(next)
        setPage(0)
        setSearch('')
    }

    const orgColumns: SimpleColumn<OrganizationDto>[] = [
        {
            key: 'name',
            label: t('org.name'),
            render: (row) => (
                <span className="inline-block max-w-48 truncate font-medium text-fg" title={row.name || '—'}>
                    {row.name || '—'}
                </span>
            ),
        },
        { key: 'phone', label: t('org.phone'), render: (row) => row.phone || '—' },
        {
            key: 'email',
            label: t('org.email'),
            render: (row) => (
                <span className="inline-block max-w-48 truncate text-fg-muted" title={row.email || '—'}>
                    {row.email || '—'}
                </span>
            ),
        },
        {
            key: 'website',
            label: t('org.website'),
            render: (row) => (
                <span className="inline-block max-w-48 truncate text-fg-muted" title={row.website || '—'}>
                    {row.website || '—'}
                </span>
            ),
        },
    ]

    const branchColumns: SimpleColumn<BranchDto>[] = [
        {
            key: 'name',
            label: t('branch.name'),
            render: (row) => (
                <span className="inline-block max-w-48 truncate font-medium text-fg" title={row.name || '—'}>
                    {row.name || '—'}
                </span>
            ),
        },
        {
            key: 'address',
            label: t('branch.address'),
            render: (row) => (
                <span className="inline-block max-w-60 truncate text-fg-muted" title={row.address || '—'}>
                    {row.address || '—'}
                </span>
            ),
        },
    ]

    return (
        <AppShell
            subtitle={t('superAdmin.role')}
            onSignOut={signOut}
            actions={
                <>
                    <SegmentedControl<Tab>
                        label={t('superAdmin.section')}
                        value={tab}
                        onChange={changeTab}
                        options={[
                            { value: 'organizations', label: t('org.plural') },
                            { value: 'branches', label: t('branch.plural') },
                        ]}
                    />
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                            tab === 'organizations'
                                ? setOrgForm({ value: null })
                                : setBranchForm({ value: null })
                        }
                    >
                        {tab === 'organizations' ? t('org.new') : t('branch.new')}
                    </Button>
                </>
            }
        >
            <AnalyticsStatsRow items={analytics.items} />

            <Panel>
                <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div className="min-w-0">
                        <Eyebrow>{t('superAdmin.eyebrow')}</Eyebrow>
                        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
                            {tab === 'organizations' ? t('org.plural') : t('branch.plural')}
                        </h1>
                    </div>
                    <Input
                        className="min-w-40 flex-1 sm:w-56 sm:flex-none"
                        placeholder={t('superAdmin.search')}
                        value={search}
                        onChange={(event) => {
                            setSearch(event.target.value)
                            setPage(0)
                        }}
                    />
                </header>

                {list.error != null && (
                    <div className="mb-4">
                        <ErrorBox>{errorMessage(list.error)}</ErrorBox>
                    </div>
                )}

                {branchMutations.remove.error != null && (
                    <div className="mb-4">
                        <ErrorBox>{errorMessage(branchMutations.remove.error)}</ErrorBox>
                    </div>
                )}

                {tab === 'organizations' ? (
                    <SimpleTable
                        rows={organizations.rows}
                        columns={orgColumns}
                        isLoading={organizations.isLoading}
                        emptyText={t('org.empty')}
                        onEdit={(row) => setOrgForm({ value: row })}
                        // O'chirish tugmasi ATAYLAB yo'q — backendda
                        // `OrganizationService.delete` bo'sh metod, lekin 204
                        // qaytaradi, ya'ni "o'chdi" degan yolg'on ko'rsatardik.
                    />
                ) : (
                    <SimpleTable
                        rows={branches.rows}
                        columns={branchColumns}
                        isLoading={branches.isLoading}
                        emptyText={t('branch.empty')}
                        onEdit={(row) => setBranchForm({ value: row })}
                        onDelete={(row) => {
                            if (!confirm(t('branch.deleteConfirm', { name: row.name ?? '' }))) return
                            branchMutations.remove.mutate(row.id)
                        }}
                    />
                )}

                <Pagination
                    page={page}
                    totalPages={list.totalPages}
                    totalElements={list.totalElements}
                    onPageChange={setPage}
                />
            </Panel>

            {orgForm && (
                <OrganizationFormModal
                    organization={orgForm.value}
                    isSaving={saveOrganization.isPending}
                    error={saveOrganization.error}
                    onSubmit={(body) =>
                        saveOrganization.mutate(
                            { id: orgForm.value?.id ?? null, body },
                            { onSuccess: () => setOrgForm(null) }
                        )
                    }
                    onClose={() => setOrgForm(null)}
                />
            )}

            {branchForm && (
                <BranchFormModal
                    branch={branchForm.value}
                    organizationOptions={organizationOptions}
                    isSaving={branchMutations.save.isPending}
                    error={branchMutations.save.error}
                    onSubmit={(body) =>
                        branchMutations.save.mutate(
                            { id: branchForm.value?.id ?? null, body },
                            { onSuccess: () => setBranchForm(null) }
                        )
                    }
                    onClose={() => setBranchForm(null)}
                />
            )}
        </AppShell>
    )
}
