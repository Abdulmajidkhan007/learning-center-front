/**
 * Backend Image DTO va javob shakllari.
 */

export interface ImageDto {
    id?: string
    imageUrl: string
    originalFileName?: string
}

/**
 * `POST /api/v1/image/upload` javob shakli.
 * Backend `imageUrl` kaliti ostida matn emas, `ImageDto` obyektini qaytaradi.
 */
export interface UploadImageResponse {
    imageUrl: ImageDto
}
