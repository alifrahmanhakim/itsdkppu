import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Book, Calendar, Shield, Upload, CheckCircle, Info } from 'lucide-react'

function TrainingSubmission({ inspectors, onSubmit, onSuccess }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        inspectorId: inspectors[0]?.id || '',
        type: 'Mandatory',
        courseName: '',
        code: '',
        trainingDate: '',
        expiryDate: '',
        provider: '',
        notes: ''
    })

    const handleFormSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate Uplink Delay
        setTimeout(() => {
            const inspectorName = inspectors.find(i => i.id === formData.inspectorId)?.name || 'UNKNOWN'
            onSubmit({ ...formData, inspectorName })
            setIsSubmitting(false)
            setSubmitted(true)

            setTimeout(() => {
                onSuccess()
            }, 2000)
        }, 1500)
    }

    if (submitted) {
        return (
            <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card"
                    style={{ padding: '3rem', textAlign: 'center', border: '1px solid var(--accent-emerald)' }}
                >
                    <CheckCircle size={64} color="var(--accent-emerald)" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px var(--accent-emerald))' }} />
                    <h2 className="hud-text" style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)', marginBottom: '1rem' }}>[ UPLINK SUCCESSFUL ]</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Logbook entry transmitted to system administrators for validation.</p>
                </motion.div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '800px', margin: '0 auto' }}
        >
            <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Book size={32} color="var(--accent-cyan)" />
                    <div>
                        <p className="hud-text" style={{ fontSize: '0.7rem', color: 'var(--accent-amber)' }}>[ PERSONNEL SELF-SERVICE PORTAL ]</p>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Flight Training Log</h1>
                    </div>
                </div>
            </header>

            <form onSubmit={handleFormSubmit} className="glass-card" style={{ padding: '2.5rem', position: 'relative' }}>
                <div className="technical-border" style={{ padding: '15px', background: 'rgba(0, 212, 255, 0.05)', marginBottom: '2rem', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Info size={18} color="var(--accent-cyan)" />
                    <p className="hud-text" style={{ fontSize: '0.65rem', lineHeight: 1.4 }}>
                        NOTICE: ALL LOG ENTRIES ARE SUBJECT TO VERIFICATION BY SUBDIRECTORATE ADMINISTRATORS.
                        FALSIFICATION OF RECORDS MAY RESULT IN SUSPENSION OF PRIVILEGES.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                    <div>
                        <label className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>PERSONNEL IDENTITY</label>
                        <select
                            value={formData.inspectorId}
                            onChange={(e) => setFormData({ ...formData, inspectorId: e.target.value })}
                            required
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: '#fff', outline: 'none' }}
                        >
                            {inspectors.map(i => <option key={i.id} value={i.id}>{i.name.toUpperCase()} [{i.id}]</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>TRAINING CATEGORY</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: '#fff', outline: 'none' }}
                        >
                            <option>Mandatory</option>
                            <option>Non-Mandatory</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>COURSE / FCN NAME</label>
                    <input
                        type="text"
                        placeholder="ENTER FULL COURSE TITLE..."
                        required
                        value={formData.courseName}
                        onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                        style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: '#fff', outline: 'none' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                    <div>
                        <label className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>COURSE CODE (FCN)</label>
                        <input
                            type="text"
                            placeholder="E.G. OPS-FORMAL-01"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: '#fff', outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>TRAINING PROVIDER</label>
                        <input
                            type="text"
                            placeholder="E.G. DGCA ACADEMY"
                            value={formData.provider}
                            onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: '#fff', outline: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                    <div>
                        <label className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>DATE OF COMPLETION</label>
                        <input
                            type="date"
                            required
                            value={formData.trainingDate}
                            onChange={(e) => setFormData({ ...formData, trainingDate: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: '#fff', outline: 'none' }}
                        />
                    </div>
                    <div>
                        <label className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>EXPIRATION DATE</label>
                        <input
                            type="date"
                            value={formData.expiryDate}
                            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--surface-border)', color: '#fff', outline: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '3rem' }}>
                    <label className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>DOCUMENT ATTACHMENT</label>
                    <div style={{
                        border: '2px dashed var(--surface-border)',
                        padding: '2rem',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.02)',
                        cursor: 'pointer'
                    }}>
                        <Upload size={24} color="var(--accent-cyan)" style={{ marginBottom: '10px' }} />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>UPLOAD CERTIFICATE / SCAN (PDF, JPG)</p>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        width: '100%',
                        padding: '18px',
                        background: isSubmitting ? 'transparent' : 'var(--accent-cyan)',
                        color: isSubmitting ? 'var(--accent-cyan)' : '#000',
                        border: isSubmitting ? '1px solid var(--accent-cyan)' : 'none',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        boxShadow: isSubmitting ? 'none' : '0 0 20px rgba(0, 212, 255, 0.4)'
                    }}
                >
                    {isSubmitting ? (
                        <>TRANSMITTING UPLINK...</>
                    ) : (
                        <>
                            <Send size={18} /> TRANSMIT LOG ENTRY
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    )
}

export default TrainingSubmission
