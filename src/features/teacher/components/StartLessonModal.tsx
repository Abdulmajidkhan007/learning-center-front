import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { useT } from '@/shared/i18n'
import { Button, ErrorBox, Field, Input, Modal } from '@/shared/ui'

interface StartLessonModalProps {
    groupName?: string
    isPending: boolean
    error: unknown
    onSubmit: (lessonName: string) => void
    onClose: () => void
}

export function StartLessonModal({ groupName, isPending, error, onSubmit, onClose }: StartLessonModalProps) {
    const { t } = useT()
    const [lessonName, setLessonName] = useState('')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onSubmit(lessonName)
    }

    return (
        <Modal
            eyebrow={t('teacher.newLesson')}
            title={t('teacher.startLessonFor', { group: groupName ?? '' })}
            onClose={onClose}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label={t('teacher.lessonName')}>
                    <Input
                        value={lessonName}
                        onChange={(event) => setLessonName(event.target.value)}
                        placeholder={t('teacher.lessonNamePlaceholder')}
                        autoFocus
                    />
                </Field>

                {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

                <div className="mt-1 flex justify-end gap-2.5">
                    <Button onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit" variant="primary" disabled={isPending}>
                        {isPending ? t('teacher.starting') : t('teacher.startLesson')}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
