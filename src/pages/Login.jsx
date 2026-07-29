import { useState } from 'react'
import { decodeJwt } from '../utils/jwt'

export default function Login({ onLoggedIn }) {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // lets the backend set its httpOnly refresh cookie
                body: JSON.stringify({ phone, password, rememberMe }),
            })
            if (!res.ok) throw new Error('Invalid phone number or password')
            const data = await res.json()
            // data: { token, expiry, refreshToken, refreshExpiry }
            const claims = decodeJwt(data.token)
            if (!claims?.role) {
                throw new Error("Logged in, but couldn't read your role from the token.")
            }
            onLoggedIn?.({ token: data.token, role: claims.role, claims })
        } catch (err) {
            setError(err.message || 'Something went wrong. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={s.page}>
            <style>{`
                .clc-input { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
                .clc-input:hover { border-color: #b7ab8a; }
                .clc-input:focus {
                    outline: none;
                    border-color: #1f2a3d;
                    box-shadow: 0 0 0 3px rgba(31, 42, 61, 0.08);
                }
                .clc-submit { transition: background 0.15s ease, transform 0.1s ease; }
                .clc-submit:hover:not(:disabled) { background: #2c3a54; }
                .clc-submit:active:not(:disabled) { transform: translateY(1px); }
                .clc-submit:disabled { opacity: 0.6; cursor: default; }
                .clc-checkbox { accent-color: #1f2a3d; width: 15px; height: 15px; cursor: pointer; }
            `}</style>

            <div style={s.panel}>
                <div style={s.brand}>
                    <span style={s.mark}>CLC</span>
                    <span style={s.brandName}>Cornerstone Learning Centre</span>
                </div>

                <h1 style={s.headline}>Welcome back to class.</h1>
                <p style={s.sub}>Sign in to pick up where you left off.</p>

                <form onSubmit={handleSubmit} style={s.form}>
                    <label style={s.field}>
                        <span style={s.eyebrow}>Phone number</span>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+998 90 123 45 67"
                            autoComplete="tel"
                            className="clc-input"
                            style={s.input}
                        />
                    </label>

                    <label style={s.field}>
                        <span style={s.eyebrow}>Password</span>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="clc-input"
                            style={s.input}
                        />
                    </label>

                    <label style={s.remember}>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="clc-checkbox"
                        />
                        Keep me signed in
                    </label>

                    {error && <p style={s.error}>{error}</p>}

                    <button type="submit" className="clc-submit" style={s.submit} disabled={loading}>
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </div>

            <div style={s.side}>
                <div style={s.ruledLines} />
                <div style={s.sideContent}>
                    <span style={s.stamp}>Est. semester one</span>
                    <p style={s.quote}>
                        "A record of every course, every cohort, every quiet bit
                        of progress — kept the way a good registrar keeps a
                        ledger."
                    </p>
                </div>
            </div>
        </div>
    )
}

const color = {
    paper: '#FAF6EE', paperLine: '#DDD3BC', card: '#FFFDF8', ink: '#1F2A3D',
    inkSoft: '#4B5768', inkFaint: '#8892A0', highlighter: '#F2B705',
    highlighterInk: '#5C4400', border: '#E2D9C4', claySoft: '#F6E6E1', clay: '#B4533C',
}
const fontDisplay = "'Fraunces', ui-serif, Georgia, serif"
const fontBody = "'Work Sans', ui-sans-serif, system-ui, sans-serif"
const fontMono = "'IBM Plex Mono', ui-monospace, monospace"

const s = {
    page: { minHeight: '100vh', display: 'grid', gridTemplateColumns: 'minmax(360px, 460px) 1fr', fontFamily: fontBody },
    panel: { display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 56px', background: color.paper },
    brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 },
    mark: { fontFamily: fontMono, fontSize: '0.75rem', letterSpacing: '0.1em', background: color.highlighter, color: color.highlighterInk, padding: '2px 6px', borderRadius: 3 },
    brandName: { fontFamily: fontMono, fontSize: '0.78rem', letterSpacing: '0.05em', color: color.inkSoft },
    headline: { fontFamily: fontDisplay, fontWeight: 600, fontSize: '2.1rem', color: color.ink, margin: '0 0 8px', letterSpacing: '-0.01em' },
    sub: { color: color.inkSoft, margin: '0 0 32px' },
    form: { display: 'flex', flexDirection: 'column', gap: 18 },
    field: { display: 'flex', flexDirection: 'column', gap: 6 },
    eyebrow: { fontFamily: fontMono, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: color.inkFaint },
    input: { fontFamily: fontBody, fontSize: '0.95rem', padding: '11px 12px', border: `1px solid ${color.border}`, borderRadius: 4, background: color.card, color: color.ink, width: '100%', boxSizing: 'border-box' },
    remember: { display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem', color: color.inkSoft },
    error: { background: color.claySoft, color: color.clay, borderRadius: 4, padding: '10px 12px', fontSize: '0.85rem', margin: 0 },
    submit: { background: color.ink, color: color.paper, border: 'none', borderRadius: 4, padding: 13, fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', marginTop: 8, fontFamily: fontBody },
    side: { position: 'relative', background: color.ink, display: 'flex', alignItems: 'flex-end', padding: 56, overflow: 'hidden' },
    ruledLines: { position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(250,246,238,0.08) 28px)` },
    sideContent: { position: 'relative', maxWidth: 380 },
    stamp: { display: 'inline-flex', fontFamily: fontMono, fontSize: '0.65rem', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '3px 8px', border: `1.5px solid ${color.highlighter}`, borderRadius: 3, color: color.highlighter, transform: 'rotate(-2deg)', marginBottom: 18 },
    quote: { fontFamily: fontDisplay, fontSize: '1.4rem', lineHeight: 1.4, fontStyle: 'italic', color: 'rgba(250,246,238,0.9)', margin: 0 },
}