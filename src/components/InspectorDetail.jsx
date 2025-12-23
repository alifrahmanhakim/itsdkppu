import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    Award,
    Briefcase,
    CheckCircle2,
    GraduationCap,
    Printer,
    FileText,
    ShieldCheck,
    Zap,
    AlertCircle,
    ClipboardCheck,
    Upload
} from 'lucide-react'
import { exportInspectorPDF } from '../utils/ExportService'

function InspectorDetail({ inspector, onBack }) {
    const [activeTab, setActiveTab] = useState('mandatory')

    if (!inspector) return null

    const navItems = [
        { id: 'mandatory', label: 'Mandatory Course Training Record', icon: GraduationCap },
        { id: 'nonMandatory', label: 'Non-Mandatory Course Training Record', icon: FileText },
        { id: 'ojt', label: 'Job-Task Training Record (OJT)', icon: Zap },
        { id: 'authorization', label: 'Inspector Authorization', icon: ShieldCheck },
        { id: 'upload', label: 'Manual Certificate Folder Upload', icon: Upload },
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <button
                    onClick={onBack}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'rgba(0, 212, 255, 0.05)',
                        border: '1px solid var(--surface-border)',
                        color: 'var(--accent-cyan)',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)'
                    }}
                >
                    <ArrowLeft size={14} /> BACK TO DATABASE
                </button>
                <h1 className="hud-text" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                    [ INSPECTOR TRAINING RECORD // ID: {inspector.id} ]
                </h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', flex: 1, minHeight: 0 }}>
                {/* Left Tactical Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '0', borderTop: '4px solid var(--accent-cyan)' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--surface-border)', background: 'rgba(0, 212, 255, 0.03)' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem', border: '2px solid var(--accent-cyan)' }}>
                                <img
                                    src={inspector.avatar}
                                    alt=""
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.2)' }}
                                />
                                <div className="rivet" style={{ top: '2px', left: '2px' }} />
                                <div className="rivet" style={{ top: '2px', right: '2px' }} />
                                <div className="rivet" style={{ bottom: '2px', left: '2px' }} />
                                <div className="rivet" style={{ bottom: '2px', right: '2px' }} />
                            </div>

                            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
                                <p className="hud-text" style={{ fontSize: '0.55rem', color: 'var(--text-dim)' }}>INSPECTOR FULLNAME</p>
                                <p style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.8rem' }}>{inspector.name}</p>

                                <p className="hud-text" style={{ fontSize: '0.55rem', color: 'var(--text-dim)' }}>WORKING UNIT</p>
                                <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.8rem' }}>{inspector.workingUnit || 'N/A'}</p>

                                <p className="hud-text" style={{ fontSize: '0.55rem', color: 'var(--text-dim)' }}>CURRENT POSITION</p>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-amber)' }}>{inspector.role.toUpperCase()}</p>
                            </div>

                            <button
                                onClick={() => exportInspectorPDF(inspector)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    background: 'var(--accent-emerald)',
                                    color: '#000',
                                    border: 'none',
                                    fontWeight: 800,
                                    fontSize: '0.7rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    boxShadow: '0 0 15px rgba(0, 255, 157, 0.3)'
                                }}>
                                <Printer size={16} /> CETAK RECORD
                            </button>
                        </div>

                        <nav style={{ padding: '10px' }}>
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        border: 'none',
                                        background: activeTab === item.id ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                                        color: activeTab === item.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        borderLeft: activeTab === item.id ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                                        marginBottom: '4px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <item.icon size={16} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: activeTab === item.id ? 700 : 400, lineHeight: 1.2 }}>
                                        {item.label.toUpperCase()}
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="glass-card" style={{ padding: '1.5rem', overflowY: 'auto', borderTop: '4px solid var(--accent-amber)' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'mandatory' && (
                                <>
                                    <div style={{ marginBottom: '2.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h2 className="hud-text" style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>[ CURRENT TRAINING RECORD ]</h2>
                                            <div className="technical-border" style={{ padding: '4px 12px' }}>
                                                <p className="hud-text" style={{ fontSize: '0.6rem' }}>DATA_STATUS: ENCRYPTED</p>
                                            </div>
                                        </div>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--surface-border)' }}>
                                                        <th className="hud-text" style={{ padding: '12px', fontSize: '0.6rem', textAlign: 'left' }}>CODE</th>
                                                        <th className="hud-text" style={{ padding: '12px', fontSize: '0.6rem', textAlign: 'left' }}>FCN NAME</th>
                                                        <th className="hud-text" style={{ padding: '12px', fontSize: '0.6rem', textAlign: 'left' }}>TRAINING PROVIDER</th>
                                                        <th className="hud-text" style={{ padding: '12px', fontSize: '0.6rem', textAlign: 'left' }}>EXPIRED</th>
                                                        <th className="hud-text" style={{ padding: '12px', fontSize: '0.6rem', textAlign: 'right' }}>STATUS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {inspector.trainingLog.mandatory.current.map((item, idx) => (
                                                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                            <td style={{ padding: '15px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{item.code}</td>
                                                            <td style={{ padding: '15px', fontWeight: 800, fontSize: '0.85rem' }}>{item.fcnName}</td>
                                                            <td style={{ padding: '15px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.training}</td>
                                                            <td style={{ padding: '15px', fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>{item.expired}</td>
                                                            <td style={{ padding: '15px', textAlign: 'right' }}>
                                                                <span className={`badge ${item.status === 'Valid' ? 'badge-success' : 'badge-red'}`} style={{ fontSize: '0.55rem', borderRadius: 0 }}>
                                                                    {item.status.toUpperCase()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                            <h2 className="hud-text" style={{ fontSize: '0.9rem', color: 'var(--accent-amber)' }}>[ OUTSTANDING TRAINING RECORD ]</h2>
                                            <p className="hud-text" style={{ fontSize: '0.6rem', opacity: 0.6 }}>AS PER CURRENT POSITION</p>
                                        </div>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--surface-border)' }}>
                                                        <th className="hud-text" style={{ padding: '12px', fontSize: '0.6rem', textAlign: 'left' }}>FCN CODE</th>
                                                        <th className="hud-text" style={{ padding: '12px', fontSize: '0.6rem', textAlign: 'left' }}>FCN NAME</th>
                                                        <th className="hud-text" style={{ padding: '12px', fontSize: '0.6rem', textAlign: 'left' }}>TYPE</th>
                                                        <th className="hud-text" style={{ padding: '12px', fontSize: '0.6rem', textAlign: 'right' }}>LAST DUE DATE</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {inspector.trainingLog.mandatory.outstanding.length > 0 ? (
                                                        inspector.trainingLog.mandatory.outstanding.map((item, idx) => (
                                                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                                <td style={{ padding: '15px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-amber)' }}>{item.code}</td>
                                                                <td style={{ padding: '15px', fontWeight: 800, fontSize: '0.85rem' }}>{item.fcnName}</td>
                                                                <td style={{ padding: '15px', fontSize: '0.8rem' }}>
                                                                    <span className="badge badge-ojt" style={{ fontSize: '0.55rem', borderRadius: 0 }}>{item.type.toUpperCase()}</span>
                                                                </td>
                                                                <td style={{ padding: '15px', textAlign: 'right', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.lastDueDate}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                                                                NO OUTSTANDING TRAINING RECORDS DETECTED.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'nonMandatory' && (
                                <div>
                                    <h2 className="hud-text" style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '1.5rem' }}>[ NON-MANDATORY COURSES ]</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                                        {inspector.trainingLog.nonMandatory.map((item, idx) => (
                                            <div key={idx} className="technical-border" style={{ padding: '15px' }}>
                                                <p className="hud-text" style={{ fontSize: '0.5rem', color: 'var(--text-dim)', marginBottom: '8px' }}>COURSE ASSET</p>
                                                <p style={{ fontWeight: 800, marginBottom: '10px' }}>{item.course.toUpperCase()}</p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.provider}</span>
                                                    <span className="hud-text" style={{ fontSize: '0.65rem', color: 'var(--accent-emerald)' }}>COMPLETED</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'ojt' && (
                                <div>
                                    <h2 className="hud-text" style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '1.5rem' }}>[ JOB-TASK TRAINING LOG ]</h2>
                                    <div className="glass" style={{ padding: '20px' }}>
                                        {inspector.trainingLog.ojt.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '20px', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ padding: '8px', background: 'rgba(255, 170, 0, 0.1)', color: 'var(--accent-amber)', borderRadius: '4px', height: 'fit-content' }}>
                                                    <Zap size={18} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{item.task.toUpperCase()}</h4>
                                                        <span className="hud-text" style={{ fontSize: '0.6rem' }}>{item.date}</span>
                                                    </div>
                                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SUPERVISOR: {item.supervisor.toUpperCase()}</p>
                                                </div>
                                                <span className={`badge ${item.status === 'Completed' ? 'badge-success' : 'badge-ojt'}`} style={{ height: 'fit-content', borderRadius: 0, fontSize: '0.55rem' }}>
                                                    {item.status.toUpperCase()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'authorization' && (
                                <div>
                                    <h2 className="hud-text" style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '1.5rem' }}>[ PERSONNEL AUTHORIZATIONS ]</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                        {inspector.trainingLog.authorization.map((auth, idx) => (
                                            <div key={idx} className="glass-card" style={{ padding: '1.5rem', borderLeft: '3px solid var(--accent-emerald)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                                    <ClipboardCheck color="var(--accent-emerald)" size={20} />
                                                    <h4 style={{ fontWeight: 800, fontSize: '0.95rem' }}>{auth.type}</h4>
                                                </div>
                                                <p className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '4px' }}>CERTIFICATE NO.</p>
                                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', marginBottom: '12px' }}>{auth.number}</p>
                                                <p className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginBottom: '4px' }}>VALIDITY LIMIT</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>{auth.validUntil}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'upload' && (
                                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                    <div className="technical-border" style={{ maxWidth: '500px', margin: '0 auto', padding: '40px', borderStyle: 'dashed' }}>
                                        <Upload size={48} color="var(--accent-cyan)" style={{ marginBottom: '20px', opacity: 0.5 }} />
                                        <h3 className="hud-text" style={{ fontSize: '0.9rem', marginBottom: '10px' }}>READY FOR ENCRYPTED UPLOAD</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '25px' }}>
                                            Select certificate files (PDF, JPG, PNG) to attach to this personnel record.
                                            Max payload size: 25MB.
                                        </p>
                                        <button className="hud-text" style={{
                                            padding: '12px 30px',
                                            background: 'transparent',
                                            border: '1px solid var(--accent-cyan)',
                                            color: 'var(--accent-cyan)',
                                            cursor: 'pointer',
                                            fontSize: '0.7rem'
                                        }}>
                                            SELECT FILES
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}

export default InspectorDetail
