import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Trash2, Plus } from 'lucide-react'

// Reusable Aviation-Styled Modal for Training Records
function TrainingRecordModal({ isOpen, onClose, inspector, onSave }) {
    if (!isOpen || !inspector) return null

    // Local state for the form so we don't mutate parent state directly until save
    const [formData, setFormData] = useState(JSON.parse(JSON.stringify(inspector)))
    const [activeTab, setActiveTab] = useState('mandatory')
    const [subTab, setSubTab] = useState('current') // For mandatory: current/outstanding

    // Reset form data when inspector changes or modal opens
    useEffect(() => {
        if (isOpen && inspector) {
            setFormData(JSON.parse(JSON.stringify(inspector)))
        }
    }, [isOpen, inspector])

    const handleSave = () => {
        onSave(formData)
        onClose()
    }

    // --- Record Management Functions ---
    const addRecord = (category, subcategory = null) => {
        const newForm = { ...formData }
        if (category === 'mandatory') {
            const newEntry = { code: '', fcnName: '', training: '', expired: '', status: 'Valid' }
            // Ensure array exists
            if (!newForm.trainingLog.mandatory[subcategory]) newForm.trainingLog.mandatory[subcategory] = []

            newForm.trainingLog.mandatory[subcategory].unshift(newEntry) // Add to top
        } else if (category === 'nonMandatory') {
            newForm.trainingLog.nonMandatory.unshift({ course: '', date: '', provider: '', status: 'Completed' })
        } else if (category === 'ojt') {
            newForm.trainingLog.ojt.unshift({ task: '', supervisor: '', status: 'Pending', date: '' })
        } else if (category === 'authorization') {
            newForm.trainingLog.authorization.unshift({ type: '', number: '', validUntil: '' })
        }
        setFormData(newForm)
    }

    const removeRecord = (category, index, subcategory = null) => {
        const newForm = { ...formData }
        if (category === 'mandatory') {
            newForm.trainingLog.mandatory[subcategory].splice(index, 1)
        } else {
            newForm.trainingLog[category].splice(index, 1)
        }
        setFormData(newForm)
    }

    const updateRecord = (category, index, field, value, subcategory = null) => {
        const newForm = { ...formData }
        if (category === 'mandatory') {
            newForm.trainingLog.mandatory[subcategory][index][field] = value
        } else {
            newForm.trainingLog[category][index][field] = value
        }
        setFormData(newForm)
    }

    // Helper for input styles
    const inputStyle = {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '8px 12px',
        color: '#fff',
        width: '100%',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.8rem',
        outline: 'none'
    }

    const labelStyle = {
        fontSize: '0.6rem',
        color: 'var(--text-dim)',
        marginBottom: '4px',
        display: 'block',
        letterSpacing: '1px'
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card"
                style={{
                    width: '900px',
                    height: '85vh',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid var(--accent-cyan)',
                    boxShadow: '0 0 40px rgba(0, 212, 255, 0.15)'
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(0, 212, 255, 0.05)'
                }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="technical-border" style={{ padding: '2px 6px', borderColor: 'var(--accent-amber)' }}>
                                <p className="hud-text" style={{ fontSize: '0.55rem', color: 'var(--accent-amber)' }}>EDIT MODE</p>
                            </div>
                            <h2 className="hud-text" style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>TRAINING RECORD MANAGER</h2>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '5px' }}>
                            TARGET: <span style={{ color: 'var(--accent-cyan)', fontWeight: 800 }}>{inspector.name}</span> // ID: {inspector.id}
                        </p>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff', padding: '8px', cursor: 'pointer', display: 'flex'
                    }}>
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['mandatory', 'nonMandatory', 'ojt', 'authorization'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className="hud-text"
                            style={{
                                flex: 1,
                                padding: '15px',
                                background: activeTab === tab ? 'rgba(0, 212, 255, 0.08)' : 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                                color: activeTab === tab ? 'var(--accent-cyan)' : 'var(--text-dim)',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab === 'nonMandatory' ? 'NON-MANDATORY' : tab.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '25px', background: 'rgba(0,0,0,0.2)' }}>

                    {/* Mandatory Content */}
                    {activeTab === 'mandatory' && (
                        <div>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <button
                                    onClick={() => setSubTab('current')}
                                    style={{
                                        padding: '8px 16px',
                                        background: subTab === 'current' ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.05)',
                                        color: subTab === 'current' ? '#000' : 'var(--text-secondary)',
                                        border: 'none',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        cursor: 'pointer'
                                    }}
                                >
                                    CURRENT / VALID
                                </button>
                                <button
                                    onClick={() => setSubTab('outstanding')}
                                    style={{
                                        padding: '8px 16px',
                                        background: subTab === 'outstanding' ? 'var(--accent-red)' : 'rgba(255,255,255,0.05)',
                                        color: subTab === 'outstanding' ? '#000' : 'var(--text-secondary)',
                                        border: 'none',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        cursor: 'pointer'
                                    }}
                                >
                                    OUTSTANDING
                                </button>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                                <button
                                    onClick={() => addRecord('mandatory', subTab)}
                                    className="hud-text"
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        background: subTab === 'current' ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                                        border: `1px solid ${subTab === 'current' ? 'var(--accent-emerald)' : 'var(--accent-red)'}`,
                                        color: subTab === 'current' ? 'var(--accent-emerald)' : 'var(--accent-red)',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem'
                                    }}
                                >
                                    <Plus size={14} /> ADD NEW RECORD
                                </button>
                            </div>

                            <div style={{ display: 'grid', gap: '10px' }}>
                                {formData.trainingLog.mandatory[subTab]?.map((item, idx) => (
                                    <div key={idx} className="technical-border" style={{
                                        display: 'grid',
                                        gridTemplateColumns: subTab === 'current' ? '1fr 2fr 1.5fr 1fr 100px 40px' : '1fr 2fr 1fr 1fr 40px',
                                        gap: '12px', padding: '15px', alignItems: 'end',
                                        background: 'rgba(255,255,255,0.02)'
                                    }}>
                                        <div>
                                            <label style={labelStyle}>CODE</label>
                                            <input
                                                style={inputStyle}
                                                value={item.code}
                                                onChange={e => updateRecord('mandatory', idx, 'code', e.target.value, subTab)}
                                                placeholder="OPS-001"
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>COURSE NAME</label>
                                            <input
                                                style={{ ...inputStyle, fontWeight: 700 }}
                                                value={item.fcnName || item.name}
                                                onChange={e => updateRecord('mandatory', idx, item.fcnName !== undefined ? 'fcnName' : 'name', e.target.value, subTab)}
                                                placeholder="Training Name"
                                            />
                                        </div>

                                        {subTab === 'current' ? (
                                            <>
                                                <div>
                                                    <label style={labelStyle}>PROVIDER</label>
                                                    <input style={inputStyle} value={item.training || item.provider} onChange={e => updateRecord('mandatory', idx, item.training !== undefined ? 'training' : 'provider', e.target.value, subTab)} />
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>EXPIRED</label>
                                                    <input type="date" style={inputStyle} value={item.expired} onChange={e => updateRecord('mandatory', idx, 'expired', e.target.value, subTab)} />
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>STATUS</label>
                                                    <select style={inputStyle} value={item.status} onChange={e => updateRecord('mandatory', idx, 'status', e.target.value, subTab)}>
                                                        <option value="Valid">Valid</option>
                                                        <option value="Expired">Expired</option>
                                                        <option value="Warning">Warning</option>
                                                    </select>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <label style={labelStyle}>TYPE</label>
                                                    <input style={inputStyle} value={item.type} onChange={e => updateRecord('mandatory', idx, 'type', e.target.value, subTab)} placeholder="Mandatory" />
                                                </div>
                                                <div>
                                                    <label style={labelStyle}>DUE DATE</label>
                                                    <input type="date" style={inputStyle} value={item.lastDueDate} onChange={e => updateRecord('mandatory', idx, 'lastDueDate', e.target.value, subTab)} />
                                                </div>
                                            </>
                                        )}

                                        <button
                                            onClick={() => removeRecord('mandatory', idx, subTab)}
                                            style={{
                                                background: 'rgba(255, 59, 48, 0.1)',
                                                border: '1px solid var(--accent-red)',
                                                color: 'var(--accent-red)',
                                                height: '36px',
                                                cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Non Mandatory Content */}
                    {activeTab === 'nonMandatory' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                                <button onClick={() => addRecord('nonMandatory')} className="hud-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', padding: '8px 16px', cursor: 'pointer', fontSize: '0.7rem' }}>
                                    <Plus size={14} /> ADD NEW RECORD
                                </button>
                            </div>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {formData.trainingLog.nonMandatory.map((item, idx) => (
                                    <div key={idx} className="technical-border" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 40px', gap: '12px', padding: '15px', alignItems: 'end', background: 'rgba(255,255,255,0.02)' }}>
                                        <div>
                                            <label style={labelStyle}>COURSE NAME</label>
                                            <input style={inputStyle} value={item.course || item.name} onChange={e => updateRecord('nonMandatory', idx, item.course !== undefined ? 'course' : 'name', e.target.value)} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>PROVIDER</label>
                                            <input style={inputStyle} value={item.provider} onChange={e => updateRecord('nonMandatory', idx, 'provider', e.target.value)} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>DATE</label>
                                            <input type="date" style={inputStyle} value={item.date} onChange={e => updateRecord('nonMandatory', idx, 'date', e.target.value)} />
                                        </div>
                                        <button onClick={() => removeRecord('nonMandatory', idx)} style={{ background: 'rgba(255, 59, 48, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* OJT Content */}
                    {activeTab === 'ojt' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                                <button onClick={() => addRecord('ojt')} className="hud-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 170, 0, 0.1)', border: '1px solid var(--accent-amber)', color: 'var(--accent-amber)', padding: '8px 16px', cursor: 'pointer', fontSize: '0.7rem' }}>
                                    <Plus size={14} /> ADD OJT RECORD
                                </button>
                            </div>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {formData.trainingLog.ojt.map((item, idx) => (
                                    <div key={idx} className="technical-border" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 100px 40px', gap: '12px', padding: '15px', alignItems: 'end', background: 'rgba(255,255,255,0.02)' }}>
                                        <div>
                                            <label style={labelStyle}>TASK / ACTIVITY</label>
                                            <input style={inputStyle} value={item.task} onChange={e => updateRecord('ojt', idx, 'task', e.target.value)} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>SUPERVISOR</label>
                                            <input style={inputStyle} value={item.supervisor} onChange={e => updateRecord('ojt', idx, 'supervisor', e.target.value)} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>DATE</label>
                                            <input type="date" style={inputStyle} value={item.date} onChange={e => updateRecord('ojt', idx, 'date', e.target.value)} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>STATUS</label>
                                            <select style={inputStyle} value={item.status} onChange={e => updateRecord('ojt', idx, 'status', e.target.value)}>
                                                <option value="Completed">Completed</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        </div>
                                        <button onClick={() => removeRecord('ojt', idx)} style={{ background: 'rgba(255, 59, 48, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Authorization Content */}
                    {activeTab === 'authorization' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                                <button onClick={() => addRecord('authorization')} className="hud-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 212, 255, 0.1)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', padding: '8px 16px', cursor: 'pointer', fontSize: '0.7rem' }}>
                                    <Plus size={14} /> ADD AUTHORIZATION
                                </button>
                            </div>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {formData.trainingLog.authorization.map((item, idx) => (
                                    <div key={idx} className="technical-border" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 40px', gap: '12px', padding: '15px', alignItems: 'end', background: 'rgba(255,255,255,0.02)' }}>
                                        <div>
                                            <label style={labelStyle}>LICENSE TYPE</label>
                                            <input style={inputStyle} value={item.type} onChange={e => updateRecord('authorization', idx, 'type', e.target.value)} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>LICENSE NUMBER</label>
                                            <input style={inputStyle} value={item.number} onChange={e => updateRecord('authorization', idx, 'number', e.target.value)} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>VALID UNTIL</label>
                                            <input type="date" style={inputStyle} value={item.validUntil} onChange={e => updateRecord('authorization', idx, 'validUntil', e.target.value)} />
                                        </div>
                                        <button onClick={() => removeRecord('authorization', idx)} style={{ background: 'rgba(255, 59, 48, 0.1)', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', justifyContent: 'flex-end', gap: '15px',
                    background: 'rgba(0,0,0,0.4)'
                }}>
                    <button
                        onClick={onClose}
                        className="hud-text"
                        style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                        }}
                    >
                        CANCEL
                    </button>
                    <button
                        onClick={handleSave}
                        className="hud-text"
                        style={{
                            padding: '12px 30px',
                            background: 'var(--accent-cyan)',
                            border: 'none',
                            color: '#000',
                            fontWeight: 800,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
                        }}
                    >
                        <Save size={16} /> SAVE CHANGES
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default TrainingRecordModal
