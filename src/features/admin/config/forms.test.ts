import { describe, expect, it } from 'vitest'
import { FORM_CONFIGS } from './forms'
import type { AdminRow } from '../types'

describe('students form config', () => {
    const config = FORM_CONFIGS.students!

    it('ichma-ich userDto dan boshlang’ich qiymatlarni oladi', () => {
        const row: AdminRow = {
            id: '1',
            userDto: { fullName: 'Aziza Karimova', phone: '+998901234567', birthDate: '2005-02-01' },
            parentPhone: '+998907654321',
        }
        expect(config.getInitialValues(row)).toEqual({
            fullName: 'Aziza Karimova',
            phone: '+998901234567',
            birthDate: '2005-02-01',
            parentPhone: '+998907654321',
        })
    })

    // StudentDto ning aniq shakli tasdiqlanmagan — yassi maydonlar zaxira yo'l.
    it('userDto bo’lmasa yassi maydonlarga tushadi', () => {
        const row: AdminRow = { id: '1', fullName: 'Bek Toshev', phone: '+998901112233' }
        expect(config.getInitialValues(row)).toMatchObject({
            fullName: 'Bek Toshev',
            phone: '+998901112233',
        })
    })

    it('yangi qator uchun bo’sh forma beradi', () => {
        expect(config.getInitialValues(null)).toEqual({
            fullName: '',
            phone: '',
            birthDate: '',
            parentPhone: '',
        })
    })

    it('create payload rolni STUDENT qilib qo’yadi', () => {
        expect(config.buildCreatePayload({ fullName: 'A', phone: 'p', birthDate: 'd', parentPhone: 'pp' })).toEqual({
            userCreateDto: { fullName: 'A', phone: 'p', birthDate: 'd', role: 'STUDENT' },
            parentPhone: 'pp',
        })
    })

    it('update payload rol yubormaydi va `user` kalitini ishlatadi', () => {
        const payload = config.buildUpdatePayload({ fullName: 'A', phone: 'p', birthDate: 'd', parentPhone: 'pp' })
        expect(payload).toEqual({
            user: { fullName: 'A', phone: 'p', birthDate: 'd' },
            parentPhone: 'pp',
        })
    })
})

describe('groups form config', () => {
    const config = FORM_CONFIGS.groups!

    it('yaratishda status maydoni ko’rsatilmaydi', () => {
        const fields = typeof config.fields === 'function' ? config.fields('create') : config.fields
        expect(fields.map((field) => field.key)).not.toContain('status')
    })

    it('tahrirlashda status maydoni qo’shiladi', () => {
        const fields = typeof config.fields === 'function' ? config.fields('edit') : config.fields
        expect(fields.map((field) => field.key)).toContain('status')
    })

    it('jadval vaqtidan soniyalarni olib tashlaydi', () => {
        const row: AdminRow = {
            id: 'g1',
            name: 'Beginners A',
            timeTable: { days: ['MONDAY', 'WEDNESDAY'], startTime: '09:00:00', endTime: '10:30:00' },
        }
        expect(config.getInitialValues(row)).toMatchObject({
            startTime: '09:00',
            endTime: '10:30',
            days: ['MONDAY', 'WEDNESDAY'],
        })
    })

    it('timeTable ni ichma-ich obyekt sifatida yuboradi', () => {
        expect(
            config.buildCreatePayload({
                name: 'Beginners A',
                room: '12',
                teacherId: 't1',
                days: ['MONDAY'],
                startTime: '09:00',
                endTime: '10:30',
            })
        ).toEqual({
            name: 'Beginners A',
            room: '12',
            teacherId: 't1',
            timeTable: { days: ['MONDAY'], startTime: '09:00', endTime: '10:30' },
        })
    })
})
