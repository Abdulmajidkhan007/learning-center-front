import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { formatHeader, singular } from '@/shared/lib'
import { Button, ErrorBox, Field, Input, Modal, Select, type SelectOption } from '@/shared/ui'
import type { WeekDay } from '@/shared/types'
import { DayPicker } from './DayPicker'
import type { EntityFormConfig, FormField, FormValues, ModalMode } from '../types'

interface EntityFormModalProps {
    mode: ModalMode
    entityLabel: string
    initialValues: FormValues
    formConfig?: EntityFormConfig
    /** Konfiguratsiyasiz rejimda maydonlar shu kalitlardan yasaladi. */
    fallbackColumns: string[]
    teacherOptions: SelectOption[]
    isSaving: boolean
    error: unknown
    onSubmit: (values: FormValues) => void
    onClose: () => void
}

function resolveFields(
    config: EntityFormConfig | undefined,
    mode: ModalMode,
    fallbackColumns: string[]
): FormField[] {
    if (!config) {
        return fallbackColumns.map((key) => ({ key, label: formatHeader(key), type: 'text' }))
    }
    return typeof config.fields === 'function' ? config.fields(mode) : config.fields
}

/**
 * Yaratish/tahrirlash formasi.
 *
 * Forma qiymatlari SHU komponent ichida yashaydi: ilgari ular sahifaning
 * `modal` state'ida edi va har harf yozilganda butun dashboard qayta
 * render bo'lardi.
 */
export function EntityFormModal({
    mode,
    entityLabel,
    initialValues,
    formConfig,
    fallbackColumns,
    teacherOptions,
    isSaving,
    error,
    onSubmit,
    onClose,
}: EntityFormModalProps) {
    const [values, setValues] = useState<FormValues>(initialValues)

    const fields = resolveFields(formConfig, mode, fallbackColumns)
    const title = `${mode === 'create' ? 'New' : 'Edit'} ${singular(entityLabel)}`

    function setValue(key: string, value: unknown) {
        setValues((current) => ({ ...current, [key]: value }))
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onSubmit(values)
    }

    if (!formConfig && fallbackColumns.length === 0) {
        return (
            <Modal
                eyebrow={mode === 'create' ? 'New record' : 'Edit record'}
                title={title}
                onClose={onClose}
                footer={<Button onClick={onClose}>Close</Button>}
            >
                <p className="text-sm leading-relaxed text-fg-muted">
                    No existing records to infer fields from yet — add one directly via your API, then
                    this form will auto-populate with the right fields.
                </p>
            </Modal>
        )
    }

    return (
        <Modal eyebrow={mode === 'create' ? 'New record' : 'Edit record'} title={title} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                {fields.map((field) => (
                    <Field key={field.key} label={field.label}>
                        {renderControl(field)}
                    </Field>
                ))}

                {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

                <div className="mt-1 flex justify-end gap-2.5">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? 'Saving…' : 'Save'}
                    </Button>
                </div>
            </form>
        </Modal>
    )

    function renderControl(field: FormField) {
        if (field.type === 'select') {
            return (
                <Select
                    placeholder="— Select —"
                    options={field.optionsSource === 'teachers' ? teacherOptions : (field.options ?? [])}
                    value={(values[field.key] as string | undefined) ?? ''}
                    onChange={(event) => setValue(field.key, event.target.value)}
                />
            )
        }

        if (field.type === 'dayPicker') {
            return (
                <DayPicker
                    value={(values[field.key] as WeekDay[] | undefined) ?? []}
                    onChange={(days) => setValue(field.key, days)}
                />
            )
        }

        const raw = values[field.key]
        return (
            <Input
                type={field.type}
                // `time` inputi 24 soatlik ko'rinishda chiqsin
                lang={field.type === 'time' ? 'ru-RU' : undefined}
                value={
                    typeof raw === 'object' && raw !== null
                        ? JSON.stringify(raw)
                        : ((raw as string | number | undefined) ?? '')
                }
                onChange={(event) => setValue(field.key, event.target.value)}
            />
        )
    }
}
