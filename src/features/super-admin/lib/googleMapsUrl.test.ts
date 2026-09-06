import { describe, expect, it } from 'vitest'
import { isShortGoogleMapsUrl, parseGoogleMapsUrl } from './googleMapsUrl'

describe('parseGoogleMapsUrl', () => {
    it('joy havolasidan koordinatani oladi', () => {
        const url =
            'https://www.google.com/maps/place/Tashkent/@41.2995,69.2401,12z/data=!4m6!3m5!1s0x38ae8b0cc379e9c3:0xa5a9323b4aa5cb98!8m2!3d41.311081!4d69.240562'
        expect(parseGoogleMapsUrl(url)).toEqual({
            latitude: 41.311081,
            longitude: 69.240562,
            googlePlaceId: '0x38ae8b0cc379e9c3:0xa5a9323b4aa5cb98',
        })
    })

    it('`!3d/!4d` bo‘lmasa `@` dagi markazni oladi', () => {
        expect(parseGoogleMapsUrl('https://www.google.com/maps/@41.2995,69.2401,12z')).toEqual({
            latitude: 41.2995,
            longitude: 69.2401,
            googlePlaceId: undefined,
        })
    })

    it('`?q=` ko‘rinishini ham tushunadi', () => {
        expect(parseGoogleMapsUrl('https://maps.google.com/?q=41.2995,69.2401')).toMatchObject({
            latitude: 41.2995,
            longitude: 69.2401,
        })
    })

    it('kodlangan vergulni ochib o‘qiydi', () => {
        expect(parseGoogleMapsUrl('https://www.google.com/maps/search/?api=1&query=41.2995%2C69.2401')).toMatchObject({
            latitude: 41.2995,
            longitude: 69.2401,
        })
    })

    it('`place_id` parametrini afzal ko‘radi', () => {
        expect(parseGoogleMapsUrl('https://maps.google.com/?q=1,2&place_id=ChIJ123abc_-XYZ').googlePlaceId).toBe(
            'ChIJ123abc_-XYZ'
        )
    })

    // Chegaradan chiqqan son — havola noto'g'ri o'qilgan degani, qabul qilinmaydi.
    it('chegaradan chiqqan koordinatani rad etadi', () => {
        expect(parseGoogleMapsUrl('https://www.google.com/maps/@191.5,300.2,12z').latitude).toBeUndefined()
    })

    it('bo‘sh satrda bo‘sh natija qaytaradi', () => {
        expect(parseGoogleMapsUrl('   ')).toEqual({})
    })

    it('koordinatasiz havolada koordinata qaytarmaydi', () => {
        expect(parseGoogleMapsUrl('https://www.google.com/maps/place/Tashkent').latitude).toBeUndefined()
    })
})

describe('isShortGoogleMapsUrl', () => {
    it('qisqartirilgan havolani taniydi', () => {
        expect(isShortGoogleMapsUrl('https://maps.app.goo.gl/abc123')).toBe(true)
        expect(isShortGoogleMapsUrl('https://www.google.com/maps/@41.3,69.2,12z')).toBe(false)
    })
})
