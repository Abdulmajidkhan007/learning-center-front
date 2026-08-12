import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { decodeJwt } from './utils/jwt'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import AttendancePage from './pages/AttendancePage'
import { AuthContext } from './AuthContext'
import type { AuthResponse, Session } from './types'

function AppShell() {
    const [session, setSession] = useState<Session | null>(null)
    const [checking, setChecking] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/api/v1/auth/refresh-token', { method: 'POST', credentials: 'include' })
            .then((res) => (res.ok ? (res.json() as Promise<AuthResponse>) : Promise.reject()))
            .then((data) => {
                const claims = decodeJwt(data.token)
                if (claims?.role) setSession({ token: data.token, role: claims.role, claims })
            })
            .catch(() => {})
            .finally(() => setChecking(false))
    }, [])

    function handleLogout() {
        setSession(null)
        navigate('/')
    }

    if (checking) return null

    if (!session) return <Login onLoggedIn={setSession} />

    return (
        <AuthContext.Provider value={{ session, onLogout: handleLogout }}>
            <Routes>
                <Route path="/attendance" element={<AttendancePage standalone />} />
                <Route path="/*" element={<DashboardRouter session={session} onLogout={handleLogout} />} />
            </Routes>
        </AuthContext.Provider>
    )
}

interface DashboardRouterProps {
    session: Session
    onLogout: () => void
}

function DashboardRouter({ session, onLogout }: DashboardRouterProps) {
    switch (session.role) {
        case 'ADMINISTRATOR':
            return <AdminDashboard session={session} onLogout={onLogout} />
        case 'TEACHER':
            return <TeacherDashboard session={session} onLogout={onLogout} />
        default:
            return (
                <div style={{ padding: 60, fontFamily: 'sans-serif' }}>
                    <p>{session.role} dashboard isn't built yet.</p>
                    <button onClick={onLogout}>Sign out</button>
                </div>
            )
    }
}

export default function App() {
    return (
        <BrowserRouter>
            <AppShell />
        </BrowserRouter>
    )
}
