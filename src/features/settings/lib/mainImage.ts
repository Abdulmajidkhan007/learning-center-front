import type { ImageDto } from '@/shared/types'

/**
 * Rasm foydalanuvchining asosiy rasmi (avatar) ekanligini aniqlaydi.
 *
 * Backend ImageDto obyektida `isMain` maydonini taqdim etmagani uchun,
 * profil rasmi URL'i (`meImageUrl`) bilan taqqoslash orqali aniqlanadi.
 */
export function isMainImage(image: ImageDto | null | undefined, meImageUrl?: string | null): boolean {
    if (!image?.imageUrl || !meImageUrl) return false
    return image.imageUrl === meImageUrl
}
