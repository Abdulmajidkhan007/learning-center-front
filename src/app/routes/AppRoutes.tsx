import { Route, Routes } from 'react-router-dom'
import { useAuth } from '@/app/providers/useAuth'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { AttendancePage } from '@/features/attendance/pages/AttendancePage'
import { RoleDashboard } from './RoleDashboard'

/**
 * Ilova marshrutlari.
 *
 * Autentifikatsiya shu yerda yagona joyda tekshiriladi: sessiya bo'lmasa
 * hech qanday himoyalangan marshrut umuman render bo'lmaydi, shuning uchun
 * ichkarida `session` doim mavjud (`useSession` shunga tayanadi).
 */
export function AppRoutes() {
    const { session, signIn, isRestoring } = useAuth()

    // Refresh-token tekshiruvi tugamaguncha bo'sh ekran: aks holda kirgan
    // foydalanuvchi bir lahza login sahifasini ko'rib qoladi.
    if (isRestoring) return null

    if (!session) return <LoginPage onLoggedIn={signIn} />

    return (
        <Routes>
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/*" element={<RoleDashboard />} />
        </Routes>
    )
}
