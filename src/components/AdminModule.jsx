import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Plus, Trash2, Edit3, Save, X, UserPlus, Database,
    AlertTriangle, ShieldAlert, Check, XCircle, Clock,
    FileText, Award, Layers, BookOpen, Trash, FileSpreadsheet
} from 'lucide-react'
import ConfirmationModal from './ConfirmationModal'
import BulkImportModal from './BulkImportModal'
import { deleteAllInspectors } from '../services/firebaseService'

function AdminModule({ inspectors = [], onUpdateInspectors, pendingSubmissions = [], onApprove, onReject }) {
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState(null)
    const [view, setView] = useState('personnel') // personnel, requirements, validation
    const [editMode, setEditMode] = useState('profile') // profile, records

    // Confirmation Modal State
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        idToDelete: null,
        nameToDelete: '',
        onConfirm: null
    })

    // Bulk Import State
    const [bulkImportOpen, setBulkImportOpen] = useState(false);

    const handleEdit = (inspector) => {
        setEditingId(inspector.id)
        setEditForm(JSON.parse(JSON.stringify(inspector))) // Deep clone
        setEditMode('profile')
    }

    const handleSave = () => {
        const newList = inspectors.map(i => i.id === editingId ? editForm : i)
        onUpdateInspectors(newList)
        setEditingId(null)
        setEditForm(null)
    }

    const handleDeleteAttempt = (inspector) => {
        setConfirmState({
            isOpen: true,
            idToDelete: inspector.id,
            nameToDelete: inspector.name,
            onConfirm: () => {
                const newList = inspectors.filter(i => i.id !== inspector.id)
                onUpdateInspectors(newList)
                setConfirmState({ ...confirmState, isOpen: false })
            }
        })
    }

    const handleDeleteAll = async () => {
        if (window.confirm("CRITICAL WARNING: This will DELETE ALL inspectors from the database. This action CANNOT be undone. Are you sure?")) {
            try {
                await deleteAllInspectors();
                onUpdateInspectors([]); // Clear local state
                alert("Database has been reset. All records deleted.");
            } catch (error) {
                console.error("Failed to delete all:", error);
                alert("Failed to reset database: " + error.message);
            }
        }
    }

    const handleAddPersonnel = () => {
        const newId = `INS-${Math.floor(100 + Math.random() * 900)}`
        const newInspector = {
            id: newId,
            name: 'NEW PERSONNEL',
            role: 'UNASSIGNED',
            subdirectorate: 'Operations',
            workingUnit: 'DKPPU',
            avatar: 'https://i.pravatar.cc/150?u=' + newId,
            trainingLog: {
                mandatory: { current: [], outstanding: [] },
                nonMandatory: [],
                ojt: [],
                authorization: []
            },
            stats: { formal: 0, ojt: 0 }
        }
        onUpdateInspectors([...inspectors, newInspector])
        handleEdit(newInspector)
    }

    // --- Record Management Functions ---
    const addRecord = (category, subcategory = null) => {
        const newForm = { ...editForm }
        if (category === 'mandatory') {
            const newEntry = { code: 'NEW-FCN', name: 'New Course', provider: 'DGCA', expired: '2026-12-31', status: 'Approved' }
            newForm.trainingLog.mandatory[subcategory].push(newEntry)
        } else if (category === 'nonMandatory') {
            newForm.trainingLog.nonMandatory.push({ name: 'New Course', date: '2024-01-01', provider: 'DGCA' })
        } else if (category === 'ojt') {
            newForm.trainingLog.ojt.push({ task: 'New Task', supervisor: 'Admin', status: 'Completed', date: '2024-01-01' })
        } else if (category === 'authorization') {
            newForm.trainingLog.authorization.push({ type: 'New Auth', number: 'DGCA/AUTH/000', validUntil: '2026-12-31' })
        }
        setEditForm(newForm)
    }

    const removeRecord = (category, index, subcategory = null) => {
        const newForm = { ...editForm }
        if (category === 'mandatory') {
            newForm.trainingLog.mandatory[subcategory].splice(index, 1)
        } else {
            newForm.trainingLog[category].splice(index, 1)
        }
        setEditForm(newForm)
    }

    const updateRecord = (category, index, field, value, subcategory = null) => {
        const newForm = { ...editForm }
        if (category === 'mandatory') {
            newForm.trainingLog.mandatory[subcategory][index][field] = value
        } else {
            newForm.trainingLog[category][index][field] = value
        }
        setEditForm(newForm)
    }

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Filter Logic (if needed later, ensuring we paginate the *filtered* list)
    // For now, using inspectors prop directly
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentInspectors = inspectors.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(inspectors.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ height: '100%' }}
        >
            <ConfirmationModal
                isOpen={confirmState.isOpen}
                title="Secure Override Protocol"
                message={`Are you sure you want to PERMANENTLY purge the records for ${confirmState.nameToDelete.toUpperCase()}? This action is IRREVERSIBLE.`}
                onConfirm={confirmState.onConfirm}
                onCancel={() => setConfirmState({ ...confirmState, isOpen: false })}
            />

            <header style={{ marginBottom: '2.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p className="hud-text" style={{ fontSize: '0.7rem', color: 'var(--accent-red)' }}>[ ADMINISTRATIVE OVERRIDE ENABLED ]</p>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Maintenance Command</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                            onClick={() => setView('validation')}
                            className="hud-text"
                            style={{
                                padding: '8px 20px',
                                background: view === 'validation' ? 'var(--accent-amber)' : 'transparent',
                                color: view === 'validation' ? '#000' : 'var(--accent-amber)',
                                border: '1px solid var(--accent-amber)',
                                cursor: 'pointer',
                                fontSize: '0.7rem',
                                position: 'relative'
                            }}
                        >
                            VALIDATION QUEUE
                            {pendingSubmissions.length > 0 && (
                                <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'var(--accent-red)', color: '#fff', fontSize: '0.5rem', padding: '2px 5px', borderRadius: '2px' }}>
                                    {pendingSubmissions.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setView('personnel')}
                            className="hud-text"
                            style={{
                                padding: '8px 20px',
                                background: view === 'personnel' ? 'var(--accent-cyan)' : 'transparent',
                                color: view === 'personnel' ? '#000' : 'var(--accent-cyan)',
                                border: '1px solid var(--accent-cyan)',
                                cursor: 'pointer',
                                fontSize: '0.7rem'
                            }}
                        >
                            PERSONNEL MGR
                        </button>
                        <button
                            onClick={() => setView('requirements')}
                            className="hud-text"
                            style={{
                                padding: '8px 20px',
                                background: view === 'requirements' ? 'var(--accent-cyan)' : 'transparent',
                                color: view === 'requirements' ? '#000' : 'var(--accent-cyan)',
                                border: '1px solid var(--accent-cyan)',
                                cursor: 'pointer',
                                fontSize: '0.7rem'
                            }}
                        >
                            REQU-LOG
                        </button>
                    </div>
                </div>
            </header>

            {view === 'personnel' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 className="hud-text" style={{ fontSize: '0.9rem' }}>Personnel Registry Database ({inspectors.length} Total)</h2>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setBulkImportOpen(true)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: 'transparent', border: '1px solid var(--accent-emerald)',
                                    padding: '8px 16px', color: 'var(--accent-emerald)',
                                    fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer'
                                }}
                            >
                                <FileSpreadsheet size={16} /> IMPORT EXCEL
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'rgba(255, 51, 51, 0.1)',
                                    border: '1px solid var(--accent-red)',
                                    color: 'var(--accent-red)',
                                    padding: '10px 16px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Trash2 size={16} /> RESET DATABASE
                            </button>
                            <button
                                onClick={handleAddPersonnel}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'var(--accent-emerald)',
                                    border: 'none',
                                    padding: '8px 16px',
                                    color: '#000',
                                    fontWeight: 800,
                                    fontSize: '0.7rem'
                                }}
                            >
                                <UserPlus size={16} /> ADD NEW PERSONNEL
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
                        {currentInspectors.map(inspector => (
                            <div key={inspector.id} className="technical-border" style={{ padding: '15px', position: 'relative', background: editingId === inspector.id ? 'rgba(0, 212, 255, 0.05)' : 'transparent' }}>
                                {editingId === inspector.id && (
                                    <div style={{
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'rgba(0,0,0,0.8)',
                                        zIndex: 1000,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backdropFilter: 'blur(5px)'
                                    }}>
                                        <div className="glass-card" style={{ width: '900px', height: '80vh', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', border: '1px solid var(--accent-cyan)' }}>
                                            {/* Header */}
                                            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 212, 255, 0.05)' }}>
                                                <div>
                                                    <p className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)' }}>[ SECURE RECORD EDITOR ]</p>
                                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>EDITING: {inspector.name}</h3>
                                                </div>
                                                <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                                            </div>

                                            {/* Tabs */}
                                            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '0 20px' }}>
                                                {['profile', 'mandatory', 'nonMandatory', 'ojt', 'authorization'].map(tab => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setEditMode(tab)}
                                                        className="hud-text"
                                                        style={{
                                                            padding: '15px 20px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            borderBottom: editMode === tab ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                                                            color: editMode === tab ? 'var(--accent-cyan)' : 'var(--text-dim)',
                                                            cursor: 'pointer',
                                                            fontSize: '0.7rem'
                                                        }}
                                                    >
                                                        {tab.replace(/([A-Z])/g, ' $1').toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Body */}
                                            <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                                                {editMode === 'profile' && (
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <div style={{ width: '150px', height: '150px', margin: '0 auto 20px', border: '2px solid var(--accent-cyan)', position: 'relative' }}>
                                                                <img src={inspector.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            </div>
                                                            <p className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>ID: {editForm.id}</p>
                                                        </div>
                                                        <div style={{ display: 'grid', gap: '20px' }}>
                                                            <div>
                                                                <label className="hud-text" style={{ display: 'block', marginBottom: '8px', fontSize: '0.6rem' }}>FULL NAME</label>
                                                                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                                            </div>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                                <div>
                                                                    <label className="hud-text" style={{ display: 'block', marginBottom: '8px', fontSize: '0.6rem' }}>ROLE</label>
                                                                    <input value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                                                </div>
                                                                <div>
                                                                    <label className="hud-text" style={{ display: 'block', marginBottom: '8px', fontSize: '0.6rem' }}>SUBDIRECTORATE</label>
                                                                    <select value={editForm.subdirectorate} onChange={e => setEditForm({ ...editForm, subdirectorate: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                                                                        <option value="Operations">Operations</option>
                                                                        <option value="Airworthiness">Airworthiness</option>
                                                                        <option value="Engineering">Engineering</option>
                                                                        <option value="Security">Security</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="hud-text" style={{ display: 'block', marginBottom: '8px', fontSize: '0.6rem' }}>WORKING UNIT</label>
                                                                <input value={editForm.workingUnit} onChange={e => setEditForm({ ...editForm, workingUnit: e.target.value })} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {editMode === 'mandatory' && (
                                                    <div>
                                                        <div style={{ marginBottom: '30px' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                                <h4 style={{ color: 'var(--accent-emerald)' }}>CURRENTLY VALID</h4>
                                                                <button onClick={() => addRecord('mandatory', 'current')} style={{ background: 'var(--accent-emerald)', border: 'none', color: '#000', padding: '5px 10px', fontSize: '0.7rem', fontWeight: 800 }}>+ ADD NEW</button>
                                                            </div>
                                                            {editForm.trainingLog.mandatory.current.map((rec, idx) => (
                                                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr 1fr 40px', gap: '10px', marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.02)' }}>
                                                                    <input value={rec.code} onChange={e => updateRecord('mandatory', idx, 'code', e.target.value, 'current')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Code" />
                                                                    <input value={rec.fcnName || rec.name} onChange={e => updateRecord('mandatory', idx, rec.fcnName ? 'fcnName' : 'name', e.target.value, 'current')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Course Name" />
                                                                    <input value={rec.training || rec.provider} onChange={e => updateRecord('mandatory', idx, rec.training ? 'training' : 'provider', e.target.value, 'current')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Provider" />
                                                                    <input type="date" value={rec.expired} onChange={e => updateRecord('mandatory', idx, 'expired', e.target.value, 'current')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} />
                                                                    <button onClick={() => removeRecord('mandatory', idx, 'current')} style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                                <h4 style={{ color: 'var(--accent-red)' }}>OUTSTANDING / EXPIRED</h4>
                                                                <button onClick={() => addRecord('mandatory', 'outstanding')} style={{ background: 'var(--accent-red)', border: 'none', color: '#000', padding: '5px 10px', fontSize: '0.7rem', fontWeight: 800 }}>+ ADD NEW</button>
                                                            </div>
                                                            {editForm.trainingLog.mandatory.outstanding.map((rec, idx) => (
                                                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 40px', gap: '10px', marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.02)' }}>
                                                                    <input value={rec.code} onChange={e => updateRecord('mandatory', idx, 'code', e.target.value, 'outstanding')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Code" />
                                                                    <input value={rec.fcnName} onChange={e => updateRecord('mandatory', idx, 'fcnName', e.target.value, 'outstanding')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Course Name" />
                                                                    <input type="date" value={rec.lastDueDate} onChange={e => updateRecord('mandatory', idx, 'lastDueDate', e.target.value, 'outstanding')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Due Date" />
                                                                    <button onClick={() => removeRecord('mandatory', idx, 'outstanding')} style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {editMode === 'nonMandatory' && (
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                            <h4 style={{ color: 'var(--accent-cyan)' }}>NON-MANDATORY RECORDS</h4>
                                                            <button onClick={() => addRecord('nonMandatory')} style={{ background: 'var(--accent-cyan)', border: 'none', color: '#000', padding: '5px 10px', fontSize: '0.7rem', fontWeight: 800 }}>+ ADD NEW</button>
                                                        </div>
                                                        {editForm.trainingLog.nonMandatory.map((rec, idx) => (
                                                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 40px', gap: '10px', marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.02)' }}>
                                                                <input value={rec.course || rec.name} onChange={e => updateRecord('nonMandatory', idx, rec.course ? 'course' : 'name', e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Course Name" />
                                                                <input value={rec.provider} onChange={e => updateRecord('nonMandatory', idx, 'provider', e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Provider" />
                                                                <input type="date" value={rec.date} onChange={e => updateRecord('nonMandatory', idx, 'date', e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} />
                                                                <button onClick={() => removeRecord('nonMandatory', idx)} style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {editMode === 'ojt' && (
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                            <h4 style={{ color: 'var(--accent-amber)' }}>OJT LOGBOOK</h4>
                                                            <button onClick={() => addRecord('ojt')} style={{ background: 'var(--accent-amber)', border: 'none', color: '#000', padding: '5px 10px', fontSize: '0.7rem', fontWeight: 800 }}>+ ADD NEW</button>
                                                        </div>
                                                        {editForm.trainingLog.ojt.map((rec, idx) => (
                                                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 40px', gap: '10px', marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.02)' }}>
                                                                <input value={rec.task} onChange={e => updateRecord('ojt', idx, 'task', e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Task Name" />
                                                                <input value={rec.supervisor} onChange={e => updateRecord('ojt', idx, 'supervisor', e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Supervisor" />
                                                                <input type="date" value={rec.date} onChange={e => updateRecord('ojt', idx, 'date', e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} />
                                                                <select value={rec.status} onChange={e => updateRecord('ojt', idx, 'status', e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }}>
                                                                    <option value="Completed">Completed</option>
                                                                    <option value="Pending">Pending</option>
                                                                </select>
                                                                <button onClick={() => removeRecord('ojt', idx)} style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {editMode === 'authorization' && (
                                                    <div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                                            <h4 style={{ color: 'var(--accent-emerald)' }}>AUTHORIZATIONS</h4>
                                                            <button onClick={() => addRecord('authorization')} style={{ background: 'var(--accent-emerald)', border: 'none', color: '#000', padding: '5px 10px', fontSize: '0.7rem', fontWeight: 800 }}>+ ADD NEW</button>
                                                        </div>
                                                        {editForm.trainingLog.authorization.map((rec, idx) => (
                                                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 40px', gap: '10px', marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.02)' }}>
                                                                <input value={rec.type} onChange={e => updateRecord('authorization', idx, 'type', e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Type" />
                                                                <input value={rec.number} onChange={e => updateRecord('authorization', idx, 'number', e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} placeholder="Number" />
                                                                <input type="date" value={rec.validUntil} onChange={e => updateRecord('authorization', idx, 'validUntil', e.target.value)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', padding: '5px', color: '#fff' }} />
                                                                <button onClick={() => removeRecord('authorization', idx)} style={{ color: 'var(--accent-red)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer */}
                                            <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: 'rgba(0,0,0,0.2)' }}>
                                                <button onClick={() => setEditingId(null)} style={{ padding: '12px 30px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>CANCEL</button>
                                                <button onClick={handleSave} style={{ padding: '12px 40px', background: 'var(--accent-cyan)', border: 'none', color: '#000', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Save size={18} /> SAVE CHANGES
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={inspector.avatar} style={{ width: '60px', height: '60px', border: '1px solid var(--accent-cyan)', filter: 'grayscale(0.5)' }} />
                                        <div className="rivet" style={{ top: '2px', left: '2px' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p className="hud-text" style={{ fontSize: '0.5rem', opacity: 0.6 }}>REG-ID: {inspector.id}</p>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{inspector.name}</h4>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                            <span style={{ fontSize: '0.6rem', color: 'var(--accent-amber)', background: 'rgba(255, 191, 0, 0.1)', padding: '2px 6px' }}>{inspector.role}</span>
                                            <span style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', background: 'rgba(0, 212, 255, 0.1)', padding: '2px 6px' }}>{inspector.subdirectorate}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <button onClick={() => handleEdit(inspector)} style={{ background: 'var(--accent-cyan)', border: 'none', color: '#000', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, fontSize: '0.7rem' }}>
                                            <Edit3 size={14} /> EDIT RECORD
                                        </button>
                                        <button onClick={() => handleDeleteAttempt(inspector)} style={{ background: 'transparent', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, fontSize: '0.7rem' }}>
                                            <Trash2 size={14} /> PURGE
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px' }}>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--accent-cyan)',
                                color: 'var(--accent-cyan)',
                                padding: '8px 20px',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                opacity: currentPage === 1 ? 0.5 : 1
                            }}
                        >
                            PREV
                        </button>
                        <span className="hud-text" style={{ fontSize: '0.8rem' }}>PAGE {currentPage} OF {totalPages}</span>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--accent-cyan)',
                                color: 'var(--accent-cyan)',
                                padding: '8px 20px',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                opacity: currentPage === totalPages ? 0.5 : 1
                            }}
                        >
                            NEXT
                        </button>
                    </div>
                </div>
            )}

            {view === 'validation' && (
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 className="hud-text" style={{ fontSize: '0.9rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Clock size={18} /> PENDING VALIDATION QUEUE
                        </h2>
                        <p className="hud-text" style={{ fontSize: '0.6rem' }}>TOTAL PENDING: {pendingSubmissions.length}</p>
                    </div>

                    {pendingSubmissions.length === 0 ? (
                        <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>
                            <ShieldAlert size={48} style={{ marginBottom: '1rem' }} />
                            <p className="hud-text">ALL CLEAR. NO PENDING CLEARANCE REQUESTS.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {pendingSubmissions.map(sub => (
                                <div key={sub.id} className="technical-border" style={{ padding: '20px', background: 'rgba(255, 191, 0, 0.05)', borderLeft: '4px solid var(--accent-amber)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '30px', alignItems: 'center' }}>
                                        <div>
                                            <p className="hud-text" style={{ fontSize: '0.5rem', marginBottom: '4px' }}>ORIGINATOR</p>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{sub.inspectorName}</h4>
                                            <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>ID: {sub.inspectorId}</p>
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', gap: '20px' }}>
                                                <div>
                                                    <p className="hud-text" style={{ fontSize: '0.5rem', marginBottom: '4px' }}>COURSE NAME</p>
                                                    <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>{sub.courseName.toUpperCase()}</p>
                                                    <p className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)' }}>CODE: {sub.code || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="hud-text" style={{ fontSize: '0.5rem', marginBottom: '4px' }}>DETAILS</p>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.1)' }}>{sub.type}</span>
                                                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.1)' }}>{sub.trainingDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => onApprove(sub.id)}
                                                style={{
                                                    background: 'var(--accent-emerald)',
                                                    border: 'none',
                                                    padding: '10px 20px',
                                                    color: '#000',
                                                    fontWeight: 900,
                                                    fontSize: '0.7rem',
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Check size={16} /> APPROVE
                                            </button>
                                            <button
                                                onClick={() => onReject(sub.id)}
                                                style={{
                                                    background: 'rgba(255, 51, 51, 0.2)',
                                                    border: '1px solid var(--accent-red)',
                                                    padding: '10px 20px',
                                                    color: 'var(--accent-red)',
                                                    fontWeight: 900,
                                                    fontSize: '0.7rem',
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <XCircle size={16} /> REJECT
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {view === 'requirements' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h2 className="hud-text" style={{ fontSize: '0.9rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ShieldAlert size={18} color="var(--accent-amber)" /> Mandatory Requirement Template
                        </h2>
                        <div className="technical-border" style={{ padding: '20px', textAlign: 'center', borderStyle: 'dashed' }}>
                            <Database size={32} color="var(--accent-cyan)" style={{ marginBottom: '15px', opacity: 0.5 }} />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>GLOBAL REQUIREMENTS CONFIGURATION</p>
                            <button className="hud-text" style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', fontSize: '0.65rem' }}>
                                MODIFY GLOBAL REQU-SET
                            </button>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h2 className="hud-text" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Validation Protocol</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div className="technical-border" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem' }}>AUTO-EXPIRY DETECTION</span>
                                <span className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--accent-emerald)' }}>ENABLED</span>
                            </div>
                            <div className="technical-border" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem' }}>MANUAL OVERRIDE LOGGING</span>
                                <span className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--accent-emerald)' }}>ENABLED</span>
                            </div>
                            <div className="technical-border" style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem' }}>PERSONNEL AUTH SYNC</span>
                                <span className="hud-text" style={{ fontSize: '0.6rem', color: 'var(--accent-amber)' }}>PENDING</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <BulkImportModal
                isOpen={bulkImportOpen}
                onClose={() => setBulkImportOpen(false)}
                onSuccess={() => {
                    // Trigger a refresh indirectly or notify user
                    alert("Import Successful! Please refresh to see new data.");
                }}
            />
        </motion.div>
    )
}

export default AdminModule
