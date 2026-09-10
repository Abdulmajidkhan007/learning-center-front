import { apiFetch } from '@/shared/api'
import type { ImageDto, Page, UploadImageResponse } from '@/shared/types'

export interface GetImagesParams {
    page?: number
    size?: number
    search?: string
}

/**
 * Foydalanuvchining rasmlari ro'yxatini oladi.
 * Backend faqat tizimga kirgan foydalanuvchiga tegishli rasmlarni qaytaradi.
 */
export async function getImages(params?: GetImagesParams, token?: string): Promise<Page<ImageDto>> {
    const result = await apiFetch<Page<ImageDto>>('/image', {
        params: params as Record<string, string | number | undefined | null>,
        token,
    })
    return result ?? { content: [], totalPages: 1, totalElements: 0 }
}

/**
 * Yangi rasm yuklaydi.
 * Multipart/form-data request, майдон номи: `file`.
 * `apiFetch` FormData obyektini to'g'ri boshqaradi (Content-Type o'rnatmaydi).
 */
export async function uploadImage(file: File, token?: string): Promise<UploadImageResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const result = await apiFetch<UploadImageResponse>('/image/upload', {
        method: 'POST',
        body: formData,
        token,
    })

    if (!result) {
        throw new Error('Image upload response was empty')
    }

    return result
}

/**
 * Tanlangan rasmni asosiy rasm (avatar) sifatida o'rnatadi.
 */
export async function setMainImage(imageId: string, token?: string): Promise<void> {
    await apiFetch<void>(`/image/main/${imageId}`, {
        method: 'PUT',
        token,
    })
}

/**
 * Rasmni o'chiradi (asosiy rasmni o'chirib bo'lmaydi).
 */
export async function deleteImage(imageId: string, token?: string): Promise<void> {
    await apiFetch<void>(`/image/${imageId}`, {
        method: 'DELETE',
        token,
    })
}
