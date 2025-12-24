import React from 'react'
import { Layout, Users, BarChart3, Settings, Plane, Shield, Radio, Activity, Terminal, BookOpen, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'

function Sidebar({ activeTab, setActiveTab, pendingCount, onLogout, currentUser }) {
    const menuItems = [
        { id: 'dashboard', icon: BarChart3, label: 'COMMAND-DASH' },
        { id: 'inspectors', icon: Users, label: 'FLIGHT-PERSONNEL' },
        { id: 'submission', icon: BookOpen, label: 'LOGBOOK-ENTRY' },
        { id: 'admin', icon: Terminal, label: 'MAINTENANCE-OP', badge: pendingCount },
        { id: 'settings', icon: Settings, label: 'SYSTEM-CONFIG' },
    ]

    return (
        <aside className="glass" style={{
            width: '280px',
            height: 'calc(100vh - 20px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            margin: '10px',
            borderLeft: '4px solid var(--accent-cyan)',
            position: 'sticky',
            top: '10px',
            overflow: 'hidden',
            flexShrink: 0
        }}>
            {/* HUD Decorative Corners */}
            <div className="rivet" style={{ top: '10px', left: '10px' }} />
            <div className="rivet" style={{ top: '10px', right: '10px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '3rem', padding: '10px', background: 'rgba(0, 212, 255, 0.05)', border: '1px solid var(--surface-border)' }}>
                <div style={{
                    width: '45px',
                    height: '45px',
                    background: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.6)'
                }}>
                    <Plane size={28} color="#000" />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.05em', color: '#fff' }}>SKYTRAIN</h2>
                    <p className="hud-text" style={{ fontSize: '0.55rem', color: 'var(--accent-amber)' }}>[ V-2.1.0-ADMIN ]</p>
                </div>
            </div>

            <nav style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeTab === item.id || (item.id === 'inspectors' && activeTab === 'detail')

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        padding: '12px 16px',
                                        border: isActive ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                                        background: isActive ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                                        color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        textAlign: 'left',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.85rem',
                                        fontWeight: isActive ? 700 : 400,
                                        letterSpacing: '0.05em',
                                        position: 'relative'
                                    }}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                    {item.badge > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            right: '15px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'var(--accent-red)',
                                            color: '#fff',
                                            fontSize: '0.6rem',
                                            padding: '2px 6px',
                                            borderRadius: '2px',
                                            fontWeight: 800,
                                            boxShadow: '0 0 10px rgba(255,51,51,0.4)'
                                        }}>
                                            {item.badge}
                                        </span>
                                    )}
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-nav"
                                            style={{
                                                marginLeft: 'auto',
                                                width: '6px',
                                                height: '6px',
                                                background: 'var(--accent-cyan)',
                                                boxShadow: '0 0 10px var(--accent-cyan)'
                                            }}
                                        />
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="technical-border" style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <Radio size={14} color="var(--accent-emerald)" />
                    <p className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--accent-emerald)' }}>DATA-LINK: ACTIVE</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={14} color="var(--accent-cyan)" />
                    <p className="hud-text" style={{ fontSize: '0.6rem' }}>OVERRIDE: ENABLED</p>
                </div>
                <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', marginTop: '12px', position: 'relative' }}>
                    <motion.div
                        animate={{ left: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        style={{ position: 'absolute', width: '20px', height: '100%', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }}
                    />
                </div>
            </div>

            {/* User Profile & Logout */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
                {/* User Profile & Logout - Identity Card Style */}
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
                    <div className="glass-card" style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            {/* Avatar Frame */}
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    width: '40px', height: '40px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    border: '2px solid var(--accent-cyan)',
                                    boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)'
                                }}>
                                    {currentUser?.photoURL ? (
                                        <img src={currentUser.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold' }}>
                                            {currentUser?.email?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                {/* Status Indicator */}
                                <div style={{
                                    position: 'absolute', bottom: '0', right: '0',
                                    width: '10px', height: '10px',
                                    background: '#10b981',
                                    borderRadius: '50%',
                                    border: '2px solid #000'
                                }}></div>
                            </div>

                            {/* User Info */}
                            <div style={{ overflow: 'hidden' }}>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {currentUser?.displayName || currentUser?.email?.split('@')[0].toUpperCase()}
                                </h4>
                                <p className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--accent-amber)' }}>SYSTEM COMMANDER</p>
                            </div>
                        </div>

                        <button
                            onClick={onLogout}
                            style={{
                                width: '100%',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: 'rgba(255, 51, 51, 0.15)',
                                border: '1px solid var(--accent-red)',
                                color: 'var(--accent-red)',
                                padding: '8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <LogOut size={12} /> TERMINATE UPLINK
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
