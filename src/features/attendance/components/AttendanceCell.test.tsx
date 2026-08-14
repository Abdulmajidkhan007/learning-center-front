import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { AttendanceCell } from './AttendanceCell'

function setup(status: 'PRESENT' | 'ABSENT' | 'EXCUSED' = 'PRESENT', reason?: string) {
    const onChange = vi.fn()
    renderWithProviders(
        <AttendanceCell studentName="Aziza Karimova" status={status} reason={reason} onChange={onChange} />
    )
    return { onChange, user: userEvent.setup() }
}

describe('AttendanceCell', () => {
    it('kvadratni bosganda keldi → kelmadi ga o’tadi', async () => {
        const { onChange, user } = setup('PRESENT')

        await user.click(screen.getByRole('button', { name: /^aziza karimova:/i }))

        expect(onChange).toHaveBeenCalledWith('ABSENT')
    })

    it('kelmadi holatida bosilsa keldi ga qaytadi', async () => {
        const { onChange, user } = setup('ABSENT')

        await user.click(screen.getByRole('button', { name: /^aziza karimova:/i }))

        expect(onChange).toHaveBeenCalledWith('PRESENT')
    })

    // Sababli holat ataylab bir bosishda chiqmaydi: tez belgilashda
    // tasodifan tushib qolmasligi kerak.
    it('sababli holat kvadratni bosish bilan qo’yilmaydi', async () => {
        const { onChange, user } = setup('EXCUSED')

        await user.click(screen.getByRole('button', { name: /^aziza karimova:/i }))

        expect(onChange).toHaveBeenCalledWith('PRESENT')
        expect(onChange).not.toHaveBeenCalledWith('EXCUSED', expect.anything())
    })

    it('burchak tugmasi izoh oynasini ochadi va sababli qilib qo’yadi', async () => {
        const { onChange, user } = setup('PRESENT')

        await user.click(screen.getByRole('button', { name: /sabab yozish/i }))
        await user.type(screen.getByRole('textbox'), 'kasal')
        await user.click(screen.getByRole('button', { name: /^sababli$/i }))

        expect(onChange).toHaveBeenCalledWith('EXCUSED', 'kasal')
    })

    it('izoh bo’sh bo’lsa ham sababli qilinadi', async () => {
        const { onChange, user } = setup('PRESENT')

        await user.click(screen.getByRole('button', { name: /sabab yozish/i }))
        await user.click(screen.getByRole('button', { name: /^sababli$/i }))

        expect(onChange).toHaveBeenCalledWith('EXCUSED', undefined)
    })

    // Backendda izoh maydoni yo'q — foydalanuvchi buni bilishi kerak.
    it('izoh saqlanmasligi haqida ogohlantiradi', async () => {
        const { user } = setup('PRESENT')

        await user.click(screen.getByRole('button', { name: /sabab yozish/i }))

        expect(screen.getByText(/serverda saqlanmaydi/i)).toBeInTheDocument()
    })
})
