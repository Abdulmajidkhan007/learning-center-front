import { useState, type FormEvent } from 'react'
import { useSession } from '@/app/providers/useAuth'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { formatHeader } from '@/shared/lib'
import { Button, ErrorBox, Field, Input, Modal, Select, type SelectOption } from '@/shared/ui'
import { useUserByPhone } from '../hooks/useUserByPhone'
import { ExistingUserNotice } from './ExistingUserNotice'
import type { UserDto } from '@/shared/types'
import type { EntityFormConfig, FormField, FormValues, ModalMode } from '../types'

interface EntityFormModalProps {
    mode: ModalMode
    /** Sarlavhada ko'rinadigan bo'lim nomi (birlikda, tarjima qilingan). */
    entityLabel: string
    initialValues: FormValues
    formConfig?: EntityFormConfig
    /** Konfiguratsiyasiz rejimda maydonlar shu kalitlardan yasaladi. */
    fallbackColumns: string[]
    teacherOptions: SelectOption[]
    groupOptions: SelectOption[]
    isSaving: boolean
    error: unknown
    onSubmit: (values: FormValues) => void
    onClose: () => void
}

/**
 * Yaratish/tahrirlash formasi.
 *
 * Forma qiymatlari SHU komponent ichida yashaydi: ilgari ular sahifaning
 * state'ida edi va har harf yozilganda butun dashboard qayta render bo'lardi.
 */
export function EntityFormModal({
    mode,
    entityLabel,
    initialValues,
    formConfig,
    fallbackColumns,
    teacherOptions,
    groupOptions,
    isSaving,
    error,
    onSubmit,
    onClose,
}: EntityFormModalProps) {
    const { t } = useT()
    const session = useSession()
    const [values, setValues] = useState<FormValues>(initialValues)

    /*
     * Telefon bo'yicha qidiruv — faqat yangi odam qo'shayotganda.
     * Tahrirlashda odam allaqachon ma'lum, qidirishning ma'nosi yo'q.
     */
    const isLookup = mode === 'create' && formConfig?.lookupByPhone === true
    const phone = String(values.phone ?? '')

    /** `null` — hali javob yo'q; `'linked'` — tasdiqlangan; `'new'` — rad etilgan. */
    const [decision, setDecision] = useState<'linked' | 'new' | null>(null)
    /**
     * Tasdiqlangan odam ALOHIDA saqlanadi, so'rov natijasidan olinmaydi:
     * tasdiqdan keyin qidiruv o'chadi va natija yo'qoladi, ya'ni unga
     * tayansak bloklash darrov tarqab ketardi.
     */
    const [linkedUser, setLinkedUser] = useState<UserDto | null>(null)
    const { found, isSearching } = useUserByPhone(session.token, phone, isLookup && decision === null)

    // Tasdiqlangan ma'lumot bu yerdan o'zgartirilmaydi: u boshqa markazlarda
    // ham ishlatiladi, bu yerda tahrirlash o'sha yozuvlarni buzadi.
    const lockedKeys = new Set(
        linkedUser
            ? [
                  ...(linkedUser.fullName ? ['fullName'] : []),
                  // Bazada yo'q maydon ochiq qoladi — uni shu yerda to'ldirish mumkin.
                  ...(linkedUser.birthDate ? ['birthDate'] : []),
              ]
            : []
    )

    function confirmExisting() {
        if (!found) return
        setValues((current) => ({
            ...current,
            fullName: found.fullName ?? current.fullName,
            birthDate: found.birthDate ?? current.birthDate,
        }))
        setLinkedUser(found)
        setDecision('linked')
    }

    const eyebrow = mode === 'create' ? t('admin.newRecord') : t('admin.editRecord')
    const title =
        mode === 'create'
            ? t('admin.newTitle', { entity: entityLabel })
            : t('admin.editTitle', { entity: entityLabel })

    const fields: FormField[] = formConfig
        ? typeof formConfig.fields === 'function'
            ? formConfig.fields(mode)
            : formConfig.fields
        : []

    /** `optionsSource` → tayyor ro'yxat. Yangi manba qo'shish bir qator. */
    const SERVER_OPTIONS: Record<NonNullable<FormField['optionsSource']>, SelectOption[]> = {
        teachers: teacherOptions,
        groups: groupOptions,
    }

    function setValue(key: string, value: unknown) {
        // Raqam o'zgarsa oldingi qaror kuchini yo'qotadi — boshqa odam
        // haqida gap ketyapti.
        if (key === 'phone') {
            setDecision(null)
            setLinkedUser(null)
        }
        setValues((current) => ({ ...current, [key]: value }))
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onSubmit(values)
    }

    if (!formConfig && fallbackColumns.length === 0) {
        return (
            <Modal
                eyebrow={eyebrow}
                title={title}
                onClose={onClose}
                footer={<Button onClick={onClose}>{t('common.close')}</Button>}
            >
                <p className="text-sm leading-relaxed text-fg-muted">{t('admin.noFields')}</p>
            </Modal>
        )
    }

    return (
        <Modal eyebrow={eyebrow} title={title} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                {formConfig
                    ? fields.map((field) => (
                          <div key={field.key} className="flex flex-col gap-1.5">
                              <Field label={t(field.labelKey)}>
                                  {renderControl(field)}
                              </Field>
                              {lockedKeys.has(field.key) && (
                                  <p className="text-[0.72rem] leading-snug text-fg-faint">
                                      {t('lookup.locked')}
                                  </p>
                              )}
                              {/* Xabar telefon maydonining ostida turadi:
                                  administrator aynan shu yerga qarab turadi. */}
                              {field.key === 'phone' && isLookup && found && decision === null && (
                                  <ExistingUserNotice
                                      user={found}
                                      onConfirm={confirmExisting}
                                      onReject={() => setDecision('new')}
                                  />
                              )}
                              {field.key === 'phone' && decision === 'new' && (
                                  <p className="text-[0.72rem] leading-snug text-danger-fg">
                                      {t('lookup.rejected')}
                                  </p>
                              )}
                              {field.key === 'phone' && isSearching && (
                                  <p className="text-[0.72rem] leading-snug text-fg-faint">
                                      {t('common.loading')}
                                  </p>
                              )}
                          </div>
                      ))
                    : fallbackColumns.map((key) => (
                          <Field key={key} label={formatHeader(key)}>
                              {renderTextInput(key)}
                          </Field>
                      ))}

                {mode === 'create' && formConfig?.createHintKey && (
                    <p className="text-[0.72rem] leading-snug text-fg-faint">
                        {t(formConfig.createHintKey)}
                    </p>
                )}

                {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

                <div className="mt-1 flex justify-end gap-2.5">
                    <Button onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? t('common.saving') : t('common.save')}
                    </Button>
                </div>
            </form>
        </Modal>
    )

    function renderControl(field: FormField) {
        if (field.type === 'select') {
            const options: SelectOption[] = field.optionsSource
                ? // Serverdan kelgan nomlar tarjima qilinmaydi — ular
                  // foydalanuvchi kiritgan ma'lumot.
                  SERVER_OPTIONS[field.optionsSource]
                : (field.options ?? []).map((option) => ({
                      value: option.value,
                      label: t(option.labelKey),
                  }))
            return (
                <Select
                    placeholder={t('field.select')}
                    options={options}
                    value={(values[field.key] as string | undefined) ?? ''}
                    onChange={(event) => setValue(field.key, event.target.value)}
                />
            )
        }

        return renderTextInput(field.key, field.type)
    }

    function renderTextInput(key: string, type: string = 'text') {
        const raw = values[key]
        return (
            <Input
                type={type}
                readOnly={lockedKeys.has(key)}
                // Telefon topilib, javob berilmaguncha qolganlari o'chiq turadi:
                // aks holda administrator yozib bo'lgach ustiga boshqa ism
                // tushadi va nima o'zgarganini sezmaydi.
                disabled={isLookup && found !== null && decision === null && key !== 'phone'}
                // `time` inputi 24 soatlik ko'rinishda chiqsin
                lang={type === 'time' ? 'ru-RU' : undefined}
                value={
                    typeof raw === 'object' && raw !== null
                        ? JSON.stringify(raw)
                        : ((raw as string | number | undefined) ?? '')
                }
                onChange={(event) => setValue(key, event.target.value)}
            />
        )
    }
}
