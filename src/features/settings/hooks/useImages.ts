import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/api'
import { deleteImage, getImages, setMainImage, uploadImage } from '../api/imagesApi'
import type { GetImagesParams } from '../api/imagesApi'

/**
 * Foydalanuvchining rasmlari ro'yxatini yuklaydi.
 */
export function useImages(token?: string, params?: GetImagesParams) {
    return useQuery({
        queryKey: queryKeys.images(params as Record<string, unknown> | undefined),
        queryFn: () => getImages(params, token),
        enabled: Boolean(token),
    })
}

/**
 * Mutatsiyalardan so'ng rasmlar ro'yxati va foydalanuvchi profili (`/auth/me`) keshlarini bekor qiladi.
 * Nega: Asosiy rasm o'zgarganda header/avatar ham darhol yangilanishi kerak.
 */
function useInvalidateImagesAndMe() {
    const queryClient = useQueryClient()

    return () => {
        void queryClient.invalidateQueries({ queryKey: queryKeys.images() })
        void queryClient.invalidateQueries({ queryKey: queryKeys.me() })
    }
}

/**
 * Yangi rasm yuklash mutatsiyasi.
 */
export function useUploadImage(token?: string) {
    const invalidate = useInvalidateImagesAndMe()

    return useMutation({
        mutationFn: (file: File) => uploadImage(file, token),
        onSuccess: invalidate,
    })
}

/**
 * Tanlangan rasmni asosiy rasm sifatida o'rnatish mutatsiyasi.
 */
export function useSetMainImage(token?: string) {
    const invalidate = useInvalidateImagesAndMe()

    return useMutation({
        mutationFn: (imageId: string) => setMainImage(imageId, token),
        onSuccess: invalidate,
    })
}

/**
 * Rasmni o'chirish mutatsiyasi.
 */
export function useDeleteImage(token?: string) {
    const invalidate = useInvalidateImagesAndMe()

    return useMutation({
        mutationFn: (imageId: string) => deleteImage(imageId, token),
        onSuccess: invalidate,
    })
}
