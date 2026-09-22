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
 *
 * `GET /image` SAHIFALANGAN emas, oddiy massiv qaytaradi
 * (`ResponseEntity<List<ImageDto>>`). Ilgari bu yerda `Page` kutilar edi va
 * `content` doim `undefined` chiqib, yuklangan rasm ham galereyada
 * ko'rinmasdi. Ikkalasini ham qabul qilamiz: backend keyin sahifalashga
 * o'tsa, ekran jimgina bo'shab qolmasin.
 */
export async function getImages(params?: GetImagesParams, token?: string): Promise<ImageDto[]> {
    const result = await apiFetch<ImageDto[] | Page<ImageDto>>('/image', {
        params: params as Record<string, string | number | undefined | null>,
        token,
    })
    if (Array.isArray(result)) return result
    return result?.content ?? []
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
