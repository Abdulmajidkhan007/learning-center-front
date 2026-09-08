export interface CsvColumn<T> {
    header: string
    accessor: (item: T) => string | number | boolean | null | undefined
}

/**
 * Katak qiymatini CSV uchun xavfsiz holatga keltiradi.
 * - `null` / `undefined` -> `""`
 * - Natija ichida `;`, `"`, `\n` yoki `\r` bo'lsa -> qo'sh tirnoqqa olinadi
 * - Qo'sh tirnoqlar dubllanadi (`""`)
 */
export function escapeCsvCell(val: unknown): string {
    if (val === null || val === undefined) {
        return ''
    }
    const str = String(val)
    const needsQuoting =
        str.includes(';') || str.includes('"') || str.includes('\n') || str.includes('\r')
    if (needsQuoting) {
        return `"${str.replaceAll('"', '""')}"`
    }
    return str
}

/**
 * Ma'lumotlar massivi va ustun ta'riflaridan UTF-8 BOM va `;` ajratgichli CSV matnini shakllantiradi.
 */
export function generateCsv<T>(data: T[], columns: CsvColumn<T>[]): string {
    const BOM = '\uFEFF'
    const headerRow = columns.map((col) => escapeCsvCell(col.header)).join(';')
    const dataRows = data.map((item) =>
        columns.map((col) => escapeCsvCell(col.accessor(item))).join(';')
    )
    return [BOM + headerRow, ...dataRows].join('\n')
}

/**
 * CSV kontentidan Blob yaratib, `<a download>` yordamida yuklab olishni boshlaydi.
 */
export function downloadCsv(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
