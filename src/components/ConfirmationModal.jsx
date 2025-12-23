import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ShieldAlert, X } from 'lucide-react'

function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="glass-card"
                style={{
                    width: '500px',
                    padding: '0',
                    border: '1px solid var(--accent-red)',
                    boxShadow: '0 0 30px rgba(255, 51, 51, 0.2)',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* HUD Decorative Corners */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', width: '20px', height: '2px', background: 'var(--accent-red)' }} />
                <div style={{ position: 'absolute', top: '10px', left: '10px', width: '2px', height: '20px', background: 'var(--accent-red)' }} />

                <div style={{ background: 'rgba(255, 51, 51, 0.1)', padding: '2rem', textAlign: 'center' }}>
                    <ShieldAlert size={48} color="var(--accent-red)" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px var(--accent-red))' }} />
                    <h2 className="hud-text" style={{ fontSize: '1.2rem', color: 'var(--accent-red)', marginBottom: '1rem', letterSpacing: '0.1em' }}>
                        [ {title.toUpperCase()} ]
                    </h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, opacity: 0.9 }}>
                        {message}
                    </p>
                </div>

                <div style={{ padding: '2rem', display: 'flex', gap: '15px', background: 'rgba(0,0,0,0.5)' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: 'transparent',
                            border: '1px solid var(--text-dim)',
                            color: 'var(--text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-mono)'
                        }}
                    >
                        [ ABORT MISSION ]
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: 'var(--accent-red)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            boxShadow: '0 0 15px rgba(255, 51, 51, 0.4)',
                            fontFamily: 'var(--font-mono)'
                        }}
                    >
                        CONFIRM OVERRIDE
                    </button>
                </div>

                {/* Technical Markers */}
                <div style={{ padding: '8px 15px', borderTop: '1px solid rgba(255,51,51,0.2)', display: 'flex', justifyContent: 'space-between' }}>
                    <p className="hud-text" style={{ fontSize: '0.5rem', color: 'var(--accent-red)' }}>SECURE-AUTH: PENDING</p>
                    <p className="hud-text" style={{ fontSize: '0.5rem', color: 'var(--accent-red)' }}>CODE-RED-7700</p>
                </div>
            </motion.div>
        </div>
    )
}

export default ConfirmationModal
