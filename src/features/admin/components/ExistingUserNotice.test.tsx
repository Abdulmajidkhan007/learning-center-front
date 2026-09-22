import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/renderWithProviders'
import { ExistingUserNotice } from './ExistingUserNotice'

const user = { id: 'u-1', fullName: 'Nodir Aliyev', birthDate: '2007-02-14' }

describe('ExistingUserNotice', () => {
    it('topilgan odamning ismi va sanasini ko’rsatadi', () => {
        renderWithProviders(
            <ExistingUserNotice user={user} onConfirm={vi.fn()} onReject={vi.fn()} />
        )

        expect(screen.getByText('Nodir Aliyev')).toBeInTheDocument()
        expect(screen.getByText('2007-02-14')).toBeInTheDocument()
    })

    /*
     * Telefon raqamlari bekor qilinib boshqa odamga beriladi. Shuning uchun
     * ma'lumot jimgina to'ldirilmaydi — administrator "shu odammi?" degan
     * savolga javob berishi kerak, aks holda yangi bolani eski egasining
     * hisobiga yozib yuboradi.
     */
    it('tasdiqlash va rad etish alohida javob qaytaradi', async () => {
        const onConfirm = vi.fn()
        const onReject = vi.fn()
        const person = userEvent.setup()

        renderWithProviders(
            <ExistingUserNotice user={user} onConfirm={onConfirm} onReject={onReject} />
        )

        await person.click(screen.getByRole('button', { name: /ha, shu odam/i }))
        expect(onConfirm).toHaveBeenCalledTimes(1)
        expect(onReject).not.toHaveBeenCalled()

        await person.click(screen.getByRole('button', { name: /boshqa odam/i }))
        expect(onReject).toHaveBeenCalledTimes(1)
    })
})
