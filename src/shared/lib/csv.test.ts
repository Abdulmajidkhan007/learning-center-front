import { describe, expect, it, vi } from 'vitest'
import { downloadCsv, escapeCsvCell, generateCsv, type CsvColumn } from './csv'

describe('escapeCsvCell', () => {
    it('null va undefined qiymatlarni bo’sh matn qiladi', () => {
        expect(escapeCsvCell(null)).toBe('')
        expect(escapeCsvCell(undefined)).toBe('')
    })

    it('oddiy matn va sonlarni o’z holicha qaytaradi', () => {
        expect(escapeCsvCell('Ali')).toBe('Ali')
        expect(escapeCsvCell(12345)).toBe('12345')
        expect(escapeCsvCell(true)).toBe('true')
    })

    it('bo’sh matnni bo’sh matn qiladi', () => {
        expect(escapeCsvCell('')).toBe('')
    })

    it('nuqtali vergul (;) bor qiymatlarni qo’shtirnoqqa oladi', () => {
        expect(escapeCsvCell('Ali; Vali')).toBe('"Ali; Vali"')
    })

    it('qo’shtirnoq bor qiymat ichidagi tirnoqlarni dubllaydi va o’zini qo’shtirnoqqa oladi', () => {
        expect(escapeCsvCell('Ali "Jons"')).toBe('"Ali ""Jons"""')
    })

    it('qator o’tishi (\\n) bor qiymatlarni qo’shtirnoqqa oladi va matnni saqlab qoladi', () => {
        expect(escapeCsvCell('Birinchi qator\nIkkinchi qator')).toBe('"Birinchi qator\nIkkinchi qator"')
        expect(escapeCsvCell('Satr1\r\nSatr2')).toBe('"Satr1\r\nSatr2"')
    })
})

describe('generateCsv', () => {
    interface TestItem {
        id: string
        name: string | null
        amount?: number
        comment?: string
    }

    const columns: CsvColumn<TestItem>[] = [
        { header: 'ID', accessor: (item) => item.id },
        { header: 'Ism; Familiya', accessor: (item) => item.name },
        { header: 'Summa', accessor: (item) => item.amount },
        { header: 'Izoh', accessor: (item) => item.comment },
    ]

    it('fayl boshiga UTF-8 BOM (\\uFEFF) qo’yadi', () => {
        const csv = generateCsv([], columns)
        expect(csv.startsWith('\uFEFF')).toBe(true)
    })

    it('ajratgich sifatida ; ishlatadi', () => {
        const items: TestItem[] = [{ id: '1', name: 'Ali', amount: 100, comment: 'yaxshi' }]
        const csv = generateCsv(items, columns)
        const lines = csv.replace('\uFEFF', '').split('\n')
        expect(lines[0]).toBe('ID;"Ism; Familiya";Summa;Izoh')
        expect(lines[1]).toBe('1;Ali;100;yaxshi')
    })

    it('bo’sh va null qiymatlarni to’g’ri boshqaradi', () => {
        const items: TestItem[] = [{ id: '2', name: null, amount: undefined, comment: '' }]
        const csv = generateCsv(items, columns)
        const lines = csv.replace('\uFEFF', '').split('\n')
        expect(lines[1]).toBe('2;;;')
    })

    it('qo’shtirnoq, nuqtali vergul va qator o’tishini o’z ichiga olgan murakkab ma’lumotlarni to’g’ri eksport qiladi', () => {
        const items: TestItem[] = [
            {
                id: '3',
                name: 'Vali "Ustoz"',
                amount: 500,
                comment: 'To’lov qilindi;\nKvitansiya #123',
            },
        ]
        const csv = generateCsv(items, columns)
        expect(csv).toBe(
            '\uFEFFID;"Ism; Familiya";Summa;Izoh\n3;"Vali ""Ustoz""";500;"To’lov qilindi;\nKvitansiya #123"'
        )
    })
})

describe('downloadCsv', () => {
    it('Blob va object URL yaratib, <a> orqali yuklab olishni chaqiradi va URL ni tozalaydi', () => {
        const createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost/mock-url')
        const revokeObjectURLMock = vi.fn()
        const clickMock = vi.fn()

        globalThis.URL.createObjectURL = createObjectURLMock
        globalThis.URL.revokeObjectURL = revokeObjectURLMock

        const dummyAnchor = document.createElement('a')
        dummyAnchor.click = clickMock

        const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(dummyAnchor)
        const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
        const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)

        downloadCsv('\uFEFFID;Name\n1;Ali', 'test-file.csv')

        expect(createObjectURLMock).toHaveBeenCalledTimes(1)
        expect(dummyAnchor.getAttribute('download')).toBe('test-file.csv')
        expect(dummyAnchor.href).toBe('blob:http://localhost/mock-url')
        expect(clickMock).toHaveBeenCalledTimes(1)
        expect(appendChildSpy).toHaveBeenCalledWith(dummyAnchor)
        expect(removeChildSpy).toHaveBeenCalledWith(dummyAnchor)
        expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:http://localhost/mock-url')

        createElementSpy.mockRestore()
        appendChildSpy.mockRestore()
        removeChildSpy.mockRestore()
    })
})
