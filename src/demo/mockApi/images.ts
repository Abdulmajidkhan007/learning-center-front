import type { ImageDto } from '@/shared/types'
import { demoUser, json, nextId, noContent, page, type Row } from './state'

/**
 * Demo uchun tayyorlangan rasmlar ro'yxati.
 */
export const demoImages: ImageDto[] = [
    {
        id: 'img-demo-1',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        originalFileName: 'profile-avatar-1.jpg',
    },
    {
        id: 'img-demo-2',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        originalFileName: 'profile-avatar-2.jpg',
    },
    {
        id: 'img-demo-3',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        originalFileName: 'profile-avatar-3.jpg',
    },
]

// Demoda boshlang'ich profil rasmi sifatida birinchi rasmni biriktirib qo'yamiz.
if (!demoUser.imageUrl && demoImages[0]) {
    demoUser.imageUrl = demoImages[0].imageUrl
}

export function handleImages(
    path: string,
    method: string,
    url: URL,
    body: Record<string, unknown>
): Response | null {
    if (!path.startsWith('/image')) return null

    // GET /image
    if (path === '/image' && method === 'GET') {
        return page(demoImages as unknown as Row[], url)
    }

    // POST /image/upload
    if (path === '/image/upload' && method === 'POST') {
        const newImage: ImageDto = {
            id: nextId('img-'),
            imageUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80&random=${Date.now()}`,
            originalFileName: typeof body?.originalFileName === 'string' ? body.originalFileName : 'uploaded-image.jpg',
        }
        demoImages.unshift(newImage)
        demoUser.imageUrl = newImage.imageUrl
        return json({ imageUrl: newImage })
    }

    // PUT /image/main/{id}
    if (path.startsWith('/image/main/') && method === 'PUT') {
        const imageId = path.replace('/image/main/', '')
        const target = demoImages.find((img) => img.id === imageId)
        if (target) {
            demoUser.imageUrl = target.imageUrl
        }
        return noContent()
    }

    // DELETE /image/{id}
    if (path.startsWith('/image/') && method === 'DELETE') {
        const imageId = path.replace('/image/', '')
        const index = demoImages.findIndex((img) => img.id === imageId)
        if (index >= 0) {
            demoImages.splice(index, 1)
        }
        return noContent()
    }

    return null
}
