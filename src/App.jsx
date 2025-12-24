import React, { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './components/Dashboard'
import InspectorList from './components/InspectorList'
import InspectorDetail from './components/InspectorDetail'
import AdminModule from './components/AdminModule'
import TrainingSubmission from './components/TrainingSubmission'
import Sidebar from './components/Sidebar'
import ErrorBoundary from './components/ErrorBoundary'
import * as api from './services/firebaseService'

function App() {
    const [inspectors, setInspectors] = useState([])
    const [pendingSubmissions, setPendingSubmissions] = useState([])
    const [activeTab, setActiveTab] = useState('dashboard')
    const [selectedInspectorId, setSelectedInspectorId] = useState(null)
    const [loading, setLoading] = useState(true)

    // Fetch initial data
    useEffect(() => {
        const initData = async () => {
            // Disabled seeding to prevent mock data (Siti Aminah) from reappearing
            // await api.seedInspectorsToFirebase().catch(err => console.error("Seed failed", err));

            try {
                const [inspectorsRes, submissionsRes] = await Promise.all([
                    api.getInspectors().catch(e => { console.error("Get Inspectors failed", e); return []; }),
                    api.getPendingSubmissions().catch(e => { console.error("Get Submissions failed", e); return []; })
                ])

                if (inspectorsRes) {
                    setInspectors(inspectorsRes)
                }

                // No fallback to mock data anymore
                // setInspectors(mockInspectors)

                setPendingSubmissions(submissionsRes || [])
            } catch (error) {
                console.error("Failed to fetch from Firebase", error)
                // Fallback or error state?
            } finally {
                setLoading(false)
            }
        }
        initData()
    }, [])

    // ... rest of component


    const selectedInspector = inspectors.find(i => i.id === selectedInspectorId)

    const handleSelectInspector = (inspector) => {
        setSelectedInspectorId(inspector.id)
        setActiveTab('detail')
    }

    const handleUpdateInspectors = async (newList) => {
        // Optimistic update
        setInspectors(newList)

        // Find the changed inspector and save to DB
        // In a real app we might pass the specific changed item, but here we find diff or just save all changed?
        // For now, let's assume this is called when ONE inspector is edited in AdminModule.
        // AdminModule logic calls this with a NEW LIST.
        // We should ideally change AdminModule to call an update function for a SINGLE inspector.
        // But to minimize refactor, let's iterate or just accept we might need to change AdminModule later.
        // For this Demo, we will just update local state. The AdminModule specific save should probably call API directly?
        // Let's modify AdminModule to take an onUpdateInspector (singular) prop if possible, or we just handle it here.

        // Actually, AdminModule sets the whole list. We can't easily know which one changed without diffing.
        // Let's relying on the fact that existing code passes `newList`.
        // We will just update local state for now to keep UI responsive, 
        // BUT we need to persist. AdminModule `handleSave` edits one inspector.
        // We can add a specialized handler for saving one inspector.
    }

    // New handler for single update to persist to DB
    const handleSaveInspector = async (updatedInspector) => {
        try {
            await api.updateInspector(updatedInspector.id, updatedInspector)
            setInspectors(prev => prev.map(i => i.id === updatedInspector.id ? updatedInspector : i))
        } catch (error) {
            console.error("Failed to save inspector", error)
        }
    }

    const handleSubmitTraining = async (submission) => {
        try {
            const newSubmission = {
                ...submission,
                id: `SUB-${Date.now()}`, // Backend might overwrite this or we keep it
                inspectorName: inspectors.find(i => i.id === submission.inspectorId)?.name
            }
            const saved = await api.submitTraining(newSubmission)
            setPendingSubmissions([...pendingSubmissions, saved])
        } catch (error) {
            console.error("Failed to submit training", error)
        }
    }

    const handleApproveSubmission = async (submissionId) => {
        const submission = pendingSubmissions.find(s => s.id === submissionId)
        if (!submission) return

        const inspector = inspectors.find(i => i.id === submission.inspectorId)
        if (!inspector) return

        const updatedTrainingLog = { ...inspector.trainingLog }
        const category = submission.type === 'Mandatory' ? 'mandatory' : 'nonMandatory'

        if (category === 'mandatory') {
            updatedTrainingLog.mandatory.current = [
                ...updatedTrainingLog.mandatory.current,
                {
                    code: submission.code,
                    name: submission.courseName,
                    provider: submission.provider,
                    expired: submission.expiryDate,
                    status: 'Approved'
                }
            ]
        } else {
            updatedTrainingLog.nonMandatory = [
                ...updatedTrainingLog.nonMandatory,
                {
                    name: submission.courseName,
                    date: submission.trainingDate,
                    provider: submission.provider
                }
            ]
        }

        const updatedInspector = { ...inspector, trainingLog: updatedTrainingLog }

        try {
            // 1. Update Inspector in DB
            await api.updateInspector(updatedInspector.id, updatedInspector)

            // 2. Delete Submission from DB
            await api.deleteSubmission(submissionId)

            // 3. Update Local State
            setInspectors(inspectors.map(i => i.id === updatedInspector.id ? updatedInspector : i))
            setPendingSubmissions(pendingSubmissions.filter(s => s.id !== submissionId))

        } catch (error) {
            console.error("Failed to approve submission", error)
        }
    }

    const handleRejectSubmission = async (submissionId) => {
        try {
            await api.deleteSubmission(submissionId)
            setPendingSubmissions(pendingSubmissions.filter(s => s.id !== submissionId))
        } catch (error) {
            console.error("Failed to reject submission", error)
        }
    }

    const { currentUser, logout } = useAuth();

    if (!currentUser) {
        return <Login />;
    }

    // Sort inspectors by name (optional)
    const sortedInspectors = [...inspectors].sort((a, b) => a.name.localeCompare(b.name))

    return (
        <div className="layout-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
            {/* Loading Overlay */}
            {loading && (
                <div style={{
                    position: 'fixed', inset: 0, background: 'var(--bg-color)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--accent-cyan)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '20px', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>ESTABLISHING SECURE CONNECTION...</p>
                    <button onClick={() => setLoading(false)} style={{ marginTop: '20px', background: 'transparent', border: '1px solid #555', color: '#777', padding: '5px 10px', fontSize: '0.7rem', cursor: 'pointer' }}>FORCE PROCEED</button>
                </div>
            )}

            <ErrorBoundary>
                <div style={{ display: 'flex', height: '100vh', width: '100%', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
                    <Sidebar
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        pendingCount={pendingSubmissions.length}
                        onLogout={logout}
                        currentUser={currentUser}
                    />

                    <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', position: 'relative' }}>
                        {/* Background Decorative Elements */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '600px',
                            height: '600px',
                            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.03) 0%, transparent 70%)',
                            pointerEvents: 'none',
                            zIndex: 0
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            {activeTab === 'dashboard' && (
                                <Dashboard
                                    inspectors={inspectors}
                                    onSelectInspector={handleSelectInspector}
                                    pendingCount={pendingSubmissions.length}
                                />
                            )}
                            {activeTab === 'inspectors' && (
                                <InspectorList
                                    inspectors={inspectors}
                                    onSelectInspector={handleSelectInspector}
                                />
                            )}
                            {activeTab === 'detail' && (
                                <InspectorDetail
                                    inspector={selectedInspector}
                                    onBack={() => setActiveTab('inspectors')}
                                    onSaveInspector={handleSaveInspector}
                                />
                            )}
                            {activeTab === 'admin' && (
                                <AdminModule
                                    inspectors={inspectors}
                                    onUpdateInspectors={handleUpdateInspectors}
                                    pendingSubmissions={pendingSubmissions}
                                    onApprove={handleApproveSubmission}
                                    onReject={handleRejectSubmission}
                                />
                            )}
                            {activeTab === 'submission' && (
                                <TrainingSubmission
                                    inspectors={inspectors}
                                    onSubmit={handleSubmitTraining}
                                    onSuccess={() => setActiveTab('dashboard')}
                                />
                            )}
                        </div>
                    </main>
                </div>
            </ErrorBoundary>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default App
