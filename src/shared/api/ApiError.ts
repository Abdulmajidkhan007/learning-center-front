/** HTTP xatosi — status kodi bilan, chunki 401 ni boshqasidan ajratish kerak. */
export class ApiError extends Error {
    readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}
