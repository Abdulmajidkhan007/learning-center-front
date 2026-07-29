import { useEffect, useState } from 'react'
import { decodeJwt } from './utils/jwt'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'

export default function App() {
    const [session, setSession] = useState(null) // { token, role, claims }
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        fetch('/api/v1/auth/refresh-token', { method: 'POST', credentials: 'include' })
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => {
                const claims = decodeJwt(data.token)
                if (claims?.role) setSession({ token: data.token, role: claims.role, claims })
            })
            .catch(() => {})
            .finally(() => setChecking(false))
    }, [])

    function handleLogout() {
        setSession(null)
    }

    if (checking) return null

    if (!session) return <Login onLoggedIn={setSession} />

    switch (session.role) {
        case 'ADMINISTRATOR':
            return <AdminDashboard session={session} onLogout={handleLogout} />
        case 'TEACHER':
            return <TeacherDashboard session={session} onLogout={handleLogout} />
        case 'STUDENT':
        case 'SUPER_ADMIN':
            return (
                <div style={{ padding: 60, fontFamily: 'sans-serif' }}>
                    <p>{session.role} dashboard isn't built yet.</p>
                    <button onClick={handleLogout}>Sign out</button>
                </div>
            )
        default:
            return <div style={{ padding: 60 }}>Unknown role: {session.role}</div>
    }
}