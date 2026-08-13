import { useState } from 'react'
import { useT } from '@/shared/i18n'
import { WEEK_DAYS, type WeekDay } from '@/shared/types'
import { Button, Field, Input, PendingBackend, PendingTag } from '@/shared/ui'
import { SettingsSection } from './SettingsSection'
import { cn } from '@/shared/lib'

/** Markaz sozlamalari — faqat administrator ko'radi (SettingsPage tekshiradi). */
export function CentreSection() {
    const { t } = useT()
    const [name, setName] = useState('')
    const [logo, setLogo] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [weekend, setWeekend] = useState<WeekDay[]>(['SUNDAY'])

    function toggleDay(day: WeekDay) {
        setWeekend((current) =>
            current.includes(day) ? current.filter((item) => item !== day) : [...current, day]
        )
    }

    return (
        <SettingsSection
            title={t('settings.centre')}
            description={t('settings.centreHint')}
            tag={<PendingTag />}
        >
            <div className="flex flex-col gap-3.5">
                <Field label={t('settings.centreName')}>
                    <Input value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <Field label={t('settings.centreLogo')}>
                    <Input
                        type="url"
                        placeholder="https://…"
                        value={logo}
                        onChange={(event) => setLogo(event.target.value)}
                    />
                </Field>

                <div className="grid gap-3.5 sm:grid-cols-2">
                    <Field label={t('settings.workStart')}>
                        <Input type="time" value={start} onChange={(event) => setStart(event.target.value)} />
                    </Field>
                    <Field label={t('settings.workEnd')}>
                        <Input type="time" value={end} onChange={(event) => setEnd(event.target.value)} />
                    </Field>
                </div>

                <Field label={t('settings.weekend')}>
                    <div className="flex flex-wrap gap-1.5">
                        {WEEK_DAYS.map((day) => {
                            const isSelected = weekend.includes(day)
                            return (
                                <button
                                    key={day}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => toggleDay(day)}
                                    className={cn(
                                        'cursor-pointer rounded-md border px-2.5 py-1.5 font-mono text-xs uppercase transition-colors',
                                        isSelected
                                            ? 'border-fg bg-fg text-fg-inverted'
                                            : 'border-border-base bg-surface-card text-fg-muted hover:border-border-strong'
                                    )}
                                >
                                    {t(`day.${day}`)}
                                </button>
                            )
                        })}
                    </div>
                </Field>

                <PendingBackend />

                <div className="flex justify-end">
                    <Button variant="primary" disabled>
                        {t('common.save')}
                    </Button>
                </div>
            </div>
        </SettingsSection>
    )
}
