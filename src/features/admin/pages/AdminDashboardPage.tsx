import { useState } from 'react'
import { useAuth, useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { singular } from '@/shared/lib'
import { GROUP_STATUSES } from '@/shared/types'
import { titleCase } from '@/shared/lib'
import {
    Button,
    ErrorBox,
    Eyebrow,
    Input,
    Pagination,
    Panel,
    Select,
    ThemeToggle,
} from '@/shared/ui'
import { AdminSidebar } from '../components/AdminSidebar'
import { AssignStudentsModal } from '../components/AssignStudentsModal'
import { EntityFormModal } from '../components/EntityFormModal'
import { EntityTable } from '../components/EntityTable'
import { StatsRow } from '../components/StatsRow'
import { COLUMN_CONFIGS, inferColumns } from '../config/columns'
import { entityByKey } from '../config/entities'
import { FORM_CONFIGS } from '../config/forms'
import { useEntityCounts } from '../hooks/useEntityCounts'
import { useEntityList } from '../hooks/useEntityList'
import { useEntityMutations } from '../hooks/useEntityMutations'
import { useTeacherOptions } from '../hooks/useTeacherOptions'
import type { AdminRow, EntityKey, FormValues, ModalMode } from '../types'

const STATUS_OPTIONS = GROUP_STATUSES.map((status) => ({ value: status, label: titleCase(status) }))

interface FormModalState {
    mode: ModalMode
    id: string | null
    values: FormValues
}

export function AdminDashboardPage() {
    const session = useSession()
    const { signOut } = useAuth()

    const [activeTab, setActiveTab] = useState<EntityKey>('students')
    const [page, setPage] = useState(0)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('STARTING')
    const [formModal, setFormModal] = useState<FormModalState | null>(null)
    const [assignGroup, setAssignGroup] = useState<AdminRow | null>(null)

    const entity = entityByKey(activeTab)
    const formConfig = FORM_CONFIGS[activeTab]
    const columnConfigs = COLUMN_CONFIGS[activeTab]

    const list = useEntityList(entity, session.token, {
        page,
        search,
        // Status filtri faqat guruhlarda ma'noga ega.
        status: activeTab === 'groups' ? statusFilter : undefined,
    })
    const counts = useEntityCounts(session.token)
    const teacherOptions = useTeacherOptions(session.token)
    const { save, remove } = useEntityMutations(entity, session.token)

    const columns = columnConfigs ? columnConfigs.map((column) => column.key) : inferColumns(list.rows)

    /** Tab almashganda sahifalash va filtrlarni tozalaymiz — aks holda
     *  yangi bo'limda "3-sahifa, qidiruv: Ali" holati qolib ketadi. */
    function changeTab(tab: EntityKey) {
        setActiveTab(tab)
        setPage(0)
        setSearch('')
        setStatusFilter('STARTING')
    }

    function openCreate() {
        const values = formConfig
            ? formConfig.getInitialValues(null)
            : Object.fromEntries(columns.map((column) => [column, '']))
        setFormModal({ mode: 'create', id: null, values })
    }

    function openEdit(row: AdminRow) {
        const values = formConfig ? formConfig.getInitialValues(row) : { ...row }
        setFormModal({ mode: 'edit', id: row.id, values })
    }

    function handleSubmit(values: FormValues) {
        if (!formModal) return

        let body: unknown
        if (formConfig) {
            body =
                formModal.mode === 'create'
                    ? formConfig.buildCreatePayload(values)
                    : formConfig.buildUpdatePayload(values)
        } else {
            const generic = { ...values }
            delete generic.id
            body = generic
        }

        save.mutate(
            { mode: formModal.mode, id: formModal.id, body },
            { onSuccess: () => setFormModal(null) }
        )
    }

    function handleDelete(row: AdminRow) {
        const what = singular(entity.label).toLowerCase()
        if (!confirm(`Delete this ${what}? This can't be undone.`)) return
        remove.mutate(row.id)
    }

    return (
        <div className="flex min-h-screen bg-surface">
            <AdminSidebar activeTab={activeTab} onTabChange={changeTab} onSignOut={signOut} />

            <main className="flex-1 overflow-x-hidden px-6 py-8 pb-16 sm:px-10">
                <div className="mb-6 flex justify-end">
                    <ThemeToggle />
                </div>

                <StatsRow counts={counts} />

                <Panel>
                    <header className="mb-5 flex flex-wrap items-end justify-between gap-3.5">
                        <div>
                            <Eyebrow>Records</Eyebrow>
                            <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
                                {entity.label}
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            {activeTab === 'groups' && (
                                <Select
                                    aria-label="Filter by status"
                                    className="w-auto"
                                    options={STATUS_OPTIONS}
                                    value={statusFilter}
                                    onChange={(event) => {
                                        setStatusFilter(event.target.value)
                                        setPage(0)
                                    }}
                                />
                            )}
                            <Input
                                className="w-full sm:w-56"
                                placeholder={`Search ${entity.label.toLowerCase()}…`}
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value)
                                    setPage(0)
                                }}
                            />
                            <Button variant="primary" onClick={openCreate}>
                                + New {singular(entity.label)}
                            </Button>
                        </div>
                    </header>

                    {list.error && (
                        <div className="mb-4">
                            <ErrorBox>
                                Couldn't load {entity.label.toLowerCase()}: {errorMessage(list.error)}
                            </ErrorBox>
                        </div>
                    )}

                    {remove.error && (
                        <div className="mb-4">
                            <ErrorBox>Couldn't delete: {errorMessage(remove.error)}</ErrorBox>
                        </div>
                    )}

                    {!list.error && (
                        <EntityTable
                            rows={list.rows}
                            columns={columns}
                            columnConfigs={columnConfigs}
                            isLoading={list.isLoading}
                            emptyLabel={entity.label.toLowerCase()}
                            onAssignStudents={activeTab === 'groups' ? setAssignGroup : undefined}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    )}

                    <Pagination
                        page={page}
                        totalPages={list.totalPages}
                        totalElements={list.totalElements}
                        onPageChange={setPage}
                    />
                </Panel>
            </main>

            {formModal && (
                <EntityFormModal
                    // `key` — tab yoki qator almashganda forma state'i
                    // toza boshlanishi uchun (React komponentni qayta yaratadi).
                    key={`${activeTab}-${formModal.id ?? 'new'}`}
                    mode={formModal.mode}
                    entityLabel={entity.label}
                    initialValues={formModal.values}
                    formConfig={formConfig}
                    fallbackColumns={columns}
                    teacherOptions={teacherOptions}
                    isSaving={save.isPending}
                    error={save.error}
                    onSubmit={handleSubmit}
                    onClose={() => setFormModal(null)}
                />
            )}

            {assignGroup && (
                <AssignStudentsModal group={assignGroup} onClose={() => setAssignGroup(null)} />
            )}
        </div>
    )
}
