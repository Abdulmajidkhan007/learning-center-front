import { useTheme } from '@/app/providers/useTheme'
import { LOCALE_LABELS, LOCALES, useT } from '@/shared/i18n'
import { Field, SegmentedControl } from '@/shared/ui'
import { SettingsSection } from './SettingsSection'
import type { Locale } from '@/shared/i18n'

/**
 * Til va tema — ikkalasi ham brauzerda saqlanadi, backend kerak emas.
 * Shuning uchun bu yagona to'liq ishlaydigan bo'lim.
 */
export function AppearanceSection() {
    const { t, locale, setLocale } = useT()
    const { theme, setTheme } = useTheme()

    return (
        <SettingsSection title={t('settings.appearance')} description={t('settings.appearanceHint')}>
            <div className="flex flex-col gap-4">
                <Field label={t('settings.language')}>
                    <SegmentedControl<Locale>
                        label={t('settings.language')}
                        value={locale}
                        onChange={setLocale}
                        options={LOCALES.map((code) => ({ value: code, label: LOCALE_LABELS[code] }))}
                    />
                </Field>

                <Field label={t('settings.theme')}>
                    <SegmentedControl
                        label={t('settings.theme')}
                        value={theme}
                        onChange={setTheme}
                        options={[
                            { value: 'light' as const, label: t('settings.themeLight') },
                            { value: 'dark' as const, label: t('settings.themeDark') },
                        ]}
                    />
                </Field>
            </div>
        </SettingsSection>
    )
}
