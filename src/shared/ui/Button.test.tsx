import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
    // Forma ichidagi tugma tasodifan submit qilib yubormasligi kerak.
    it('sukut bo’yicha type="button" bo’ladi', () => {
        render(<Button>Save</Button>)
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    })

    it('type ni ochiq berish mumkin', () => {
        render(<Button type="submit">Save</Button>)
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })

    it('disabled holatda bosilmaydi', async () => {
        const onClick = vi.fn()
        const user = userEvent.setup()

        render(
            <Button disabled onClick={onClick}>
                Save
            </Button>
        )
        await user.click(screen.getByRole('button'))

        expect(onClick).not.toHaveBeenCalled()
    })
})
