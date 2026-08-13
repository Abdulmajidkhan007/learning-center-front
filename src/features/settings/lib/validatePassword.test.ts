import { describe, expect, it } from 'vitest'
import { validatePasswordChange } from './validatePassword'

describe('validatePasswordChange', () => {
    it('to’g’ri to’ldirilganda muammo yo’q', () => {
        expect(
            validatePasswordChange({ current: 'eski123456', next: 'yangi12345', repeat: 'yangi12345' })
        ).toBeNull()
    })

    it('bo’sh maydonni ushlaydi', () => {
        expect(validatePasswordChange({ current: '', next: 'yangi12345', repeat: 'yangi12345' })).toBe(
            'empty'
        )
        expect(validatePasswordChange({ current: 'eski123456', next: '', repeat: '' })).toBe('empty')
    })

    it('qisqa parolni rad etadi', () => {
        expect(validatePasswordChange({ current: 'eski123456', next: 'qisqa', repeat: 'qisqa' })).toBe(
            'tooShort'
        )
    })

    it('takrori mos kelmasa xato beradi', () => {
        expect(
            validatePasswordChange({ current: 'eski123456', next: 'yangi12345', repeat: 'yangi54321' })
        ).toBe('mismatch')
    })

    // Bo'shliq tekshiruvi uzunlikdan oldin ishlashi kerak, aks holda
    // foydalanuvchi "juda qisqa" degan chalg'ituvchi xabarni ko'radi.
    it('bo’shlik xatosi uzunlik xatosidan oldin keladi', () => {
        expect(validatePasswordChange({ current: '', next: 'ab', repeat: 'ab' })).toBe('empty')
    })
})
