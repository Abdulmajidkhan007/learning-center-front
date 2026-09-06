/**
 * Google Maps havolasidan koordinata va joy identifikatorini ajratadi.
 *
 * NEGA shunday: haqiqiy xarita tanlagich Google Maps API kalitini talab
 * qiladi — kalit pullik va uni frontendga yozish loyiha qoidasiga zid.
 * Administrator Maps'da joyni topib, havolani nusxalab qo'yadi — shu yetarli,
 * chunki backend `latitude`, `longitude`, `googlePlaceId` va `googleMapsUrl`
 * ni oddiy maydon sifatida saqlaydi.
 */
export interface ParsedGoogleMapsUrl {
    latitude?: number
    longitude?: number
    googlePlaceId?: string
}

/** Kenglik −90..90, uzunlik −180..180 — bundan tashqarisi noto'g'ri o'qilgan. */
function isValidPair(lat: number, lng: number): boolean {
    return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
}

function readCoordinates(url: string): { latitude: number; longitude: number } | null {
    // `!3d41.31!4d69.24` — joyning O'ZINING koordinatasi, shuning uchun birinchi
    // o'rinda: `@...` esa faqat ekran markazi bo'lib, joydan siljigan bo'lishi mumkin.
    const patterns = [
        /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
        /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
        /[?&](?:q|query|ll|center|destination)=(-?\d+(?:\.\d+)?)(?:,|%2C)(-?\d+(?:\.\d+)?)/i,
    ]

    for (const pattern of patterns) {
        const match = url.match(pattern)
        if (!match) continue
        const latitude = Number.parseFloat(match[1])
        const longitude = Number.parseFloat(match[2])
        if (isValidPair(latitude, longitude)) return { latitude, longitude }
    }
    return null
}

function readPlaceId(url: string): string | undefined {
    const explicit = url.match(/[?&](?:place_id|placeid)=([A-Za-z0-9_-]+)/i)
    if (explicit) return explicit[1]

    // Uzun havolada joy identifikatori `data=` ichida `!1s0x…:0x…` ko'rinishida keladi.
    const embedded = url.match(/!1s(0x[0-9a-f]+(?::0x[0-9a-f]+)?)/i)
    if (embedded) return embedded[1]

    const ftid = url.match(/[?&]ftid=(0x[0-9a-f]+(?::0x[0-9a-f]+)?)/i)
    return ftid ? ftid[1] : undefined
}

export function parseGoogleMapsUrl(raw: string): ParsedGoogleMapsUrl {
    const url = raw.trim()
    if (url === '') return {}

    const coordinates = readCoordinates(decodeURIComponent(url))
    return { ...coordinates, googlePlaceId: readPlaceId(url) }
}

/**
 * `maps.app.goo.gl` qisqartmasi ichida koordinata YO'Q — uni ochmasdan
 * o'qib bo'lmaydi. Foydalanuvchiga to'liq havolani nusxalash kerakligini
 * aytish uchun shu tekshiruv ishlatiladi.
 */
export function isShortGoogleMapsUrl(raw: string): boolean {
    return /(?:maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(raw.trim())
}
