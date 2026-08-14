/** HTTP xatosi — status kodi bilan, chunki 401 ni boshqasidan ajratish kerak. */
export class ApiError extends Error {
    readonly status: number
    /**
     * Backendning `errorCode` i (`NotFound`, `AlreadyExists`, …).
     *
     * `message` allaqachon tarjima qilingan holda keladi, shuning uchun uni
     * shundoq ko'rsataveramiz. Kod esa xato TURIGA qarab boshqacha ish
     * qilish kerak bo'lganda ishlatiladi (masalan "band raqam" ni formaning
     * o'sha maydoniga bog'lash).
     */
    readonly code?: string

    constructor(message: string, status: number, code?: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.code = code
    }
}
