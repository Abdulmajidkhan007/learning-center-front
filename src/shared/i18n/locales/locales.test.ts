import { describe, expect, it } from 'vitest'
import { uz } from './uz'
import { ru } from './ru'
import { en } from './en'
import { translate } from '../translate'

const DICTS = { uz, ru, en }

describe('tarjima lug’atlari', () => {
    // Tip tizimi kalit yetishmasligini ushlaydi, bu test esa qo'shimchasini:
    // ortiqcha kalit va bo'sh matn.
    it('barcha tillarda kalitlar to’plami bir xil', () => {
        const expected = Object.keys(uz).sort()
        for (const [name, dict] of Object.entries(DICTS)) {
            expect(Object.keys(dict).sort(), `${name} lug'ati`).toEqual(expected)
        }
    })

    it('hech bir matn bo’sh emas', () => {
        for (const [name, dict] of Object.entries(DICTS)) {
            for (const [key, value] of Object.entries(dict)) {
                expect(value.trim(), `${name} → ${key}`).not.toBe('')
            }
        }
    })

    // O'rin egallovchi bir tilda bo'lib, boshqasida unutilsa — ekranda
    // "Sahifa  / " kabi buzuq matn chiqadi. Buni oldindan ushlaymiz.
    it('o’rin egallovchilar barcha tillarda bir xil', () => {
        const placeholders = (text: string) =>
            (text.match(/\{\{(\w+)\}\}/g) ?? []).sort().join(',')

        for (const key of Object.keys(uz) as (keyof typeof uz)[]) {
            const expected = placeholders(uz[key])
            for (const [name, dict] of Object.entries(DICTS)) {
                expect(placeholders(dict[key]), `${name} → ${key}`).toBe(expected)
            }
        }
    })
})

describe('translate', () => {
    it('tilga qarab matnni tanlaydi', () => {
        expect(translate('uz', 'common.save')).toBe('Saqlash')
        expect(translate('ru', 'common.save')).toBe('Сохранить')
        expect(translate('en', 'common.save')).toBe('Save')
    })

    it('o’rin egallovchilarni almashtiradi', () => {
        expect(translate('en', 'common.pageInfo', { page: 2, total: 5, count: 42 })).toBe(
            'Page 2 of 5 · 42 total'
        )
    })

    it('berilmagan o’zgaruvchini bo’sh qoldiradi, "undefined" yozmaydi', () => {
        expect(translate('en', 'admin.deleteFailed', {})).toBe("Couldn't delete: ")
    })
})
