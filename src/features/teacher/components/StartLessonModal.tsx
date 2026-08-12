import { useState, type FormEvent } from 'react'
import { errorMessage } from '@/shared/api'
import { Button, ErrorBox, Field, Input, Modal } from '@/shared/ui'

interface StartLessonModalProps {
    groupName?: string
    isPending: boolean
    error: unknown
    onSubmit: (lessonName: string) => void
    onClose: () => void
}

export function StartLessonModal({ groupName, isPending, error, onSubmit, onClose }: StartLessonModalProps) {
    const [lessonName, setLessonName] = useState('')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onSubmit(lessonName)
    }

    return (
        <Modal eyebrow="New lesson" title={`Start lesson for ${groupName ?? ''}`} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <Field label="Lesson name (optional)">
                    <Input
                        value={lessonName}
                        onChange={(event) => setLessonName(event.target.value)}
                        placeholder="e.g. Present Simple — review"
                        autoFocus
                    />
                </Field>

                {error != null && <ErrorBox>{errorMessage(error)}</ErrorBox>}

                <div className="mt-1 flex justify-end gap-2.5">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isPending}>
                        {isPending ? 'Starting…' : 'Start lesson'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}
