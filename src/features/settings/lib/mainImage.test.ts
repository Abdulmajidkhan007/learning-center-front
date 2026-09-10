import { describe, expect, it } from 'vitest'
import { isMainImage } from './mainImage'

describe('isMainImage', () => {
    it('returns true when the image URL matches the user profile image URL', () => {
        const image = { id: 'img-1', imageUrl: 'https://example.com/avatar.jpg' }
        const meImageUrl = 'https://example.com/avatar.jpg'

        expect(isMainImage(image, meImageUrl)).toBe(true)
    })

    it('returns false when the URLs do not match', () => {
        const image = { id: 'img-1', imageUrl: 'https://example.com/other.jpg' }
        const meImageUrl = 'https://example.com/avatar.jpg'

        expect(isMainImage(image, meImageUrl)).toBe(false)
    })

    it('returns false when image or meImageUrl is empty, null, or undefined', () => {
        expect(isMainImage(null, 'https://example.com/avatar.jpg')).toBe(false)
        expect(isMainImage(undefined, 'https://example.com/avatar.jpg')).toBe(false)
        expect(isMainImage({ imageUrl: '' }, 'https://example.com/avatar.jpg')).toBe(false)
        expect(isMainImage({ imageUrl: 'https://example.com/avatar.jpg' }, null)).toBe(false)
        expect(isMainImage({ imageUrl: 'https://example.com/avatar.jpg' }, undefined)).toBe(false)
        expect(isMainImage({ imageUrl: 'https://example.com/avatar.jpg' }, '')).toBe(false)
    })
})
