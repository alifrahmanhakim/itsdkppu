import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plane, Lock, AlertTriangle } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginWithGoogle } = useAuth();

    async function handleGoogleLogin() {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
        } catch (err) {
            setError('Failed to sign in with Google. Ensure pop-ups are allowed.');
            console.error(err);
        }
        setLoading(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            // Redirect is handled by App.jsx conditional rendering
        } catch (err) {
            setError('Failed to sign in. Please check your credentials.');
            console.error(err);
        }
        setLoading(false);
    }

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Background Effects */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.05), transparent 70%)', pointerEvents: 'none' }}></div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)', opacity: 0.3 }}></div>

            <div className="glass-card" style={{
                width: '400px',
                padding: '40px',
                border: '1px solid var(--accent-cyan)',
                background: 'rgba(10, 10, 10, 0.8)',
                boxShadow: '0 0 50px rgba(0, 212, 255, 0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{
                        width: '60px', height: '60px',
                        background: 'rgba(0, 212, 255, 0.1)',
                        border: '1px solid var(--accent-cyan)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <Plane color="var(--accent-cyan)" size={32} />
                    </div>
                    <h1 className="hud-text" style={{ fontSize: '1.5rem', marginBottom: '10px' }}>SKYTRAIN SYSTEM</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px' }}>SECURE ACCESS TERMINAL</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(255, 59, 48, 0.1)',
                        border: '1px solid var(--accent-red)',
                        padding: '12px',
                        borderRadius: '4px',
                        display: 'flex', gap: '10px', alignItems: 'center',
                        marginBottom: '20px'
                    }}>
                        <AlertTriangle color="var(--accent-red)" size={16} />
                        <span style={{ color: 'var(--accent-red)', fontSize: '0.8rem' }}>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label className="hud-text" style={{ fontSize: '0.7rem', display: 'block', marginBottom: '8px' }}>USER IDENTIFIER</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#fff',
                                outline: 'none'
                            }}
                            placeholder="officer@dkppu.go.id"
                        />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <label className="hud-text" style={{ fontSize: '0.7rem', display: 'block', marginBottom: '8px' }}>ACCESS KEY</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#fff',
                                outline: 'none'
                            }}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: 'var(--accent-cyan)',
                            border: 'none',
                            color: '#000',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            fontSize: '0.9rem',
                            letterSpacing: '1px'
                        }}
                    >
                        {loading ? 'AUTHENTICATING...' : <><Lock size={16} /> INITIALIZE SESSION</>}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>OR ACCESS VIA</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'white',
                            border: 'none',
                            color: '#000',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            fontSize: '0.8rem',
                            borderRadius: '4px'
                        }}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google" />
                        SIGN IN WITH GOOGLE
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>SYSTEM VERSION 2.1.0-SECURE</p>
                </div>
            </div>
        </div>
    );
}
