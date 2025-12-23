import React, { useState } from 'react'
import Dashboard from './components/Dashboard'
import InspectorList from './components/InspectorList'
import InspectorDetail from './components/InspectorDetail'
import AdminModule from './components/AdminModule'
import TrainingSubmission from './components/TrainingSubmission'
import Sidebar from './components/Sidebar'
import { mockInspectors } from './data/mockData'

function App() {
    const [inspectors, setInspectors] = useState(mockInspectors)
    const [pendingSubmissions, setPendingSubmissions] = useState([])
    const [activeTab, setActiveTab] = useState('dashboard')
    const [selectedInspectorId, setSelectedInspectorId] = useState(null)

    const selectedInspector = inspectors.find(i => i.id === selectedInspectorId)

    const handleSelectInspector = (inspector) => {
        setSelectedInspectorId(inspector.id)
        setActiveTab('detail')
    }

    const handleUpdateInspectors = (newList) => {
        setInspectors(newList)
    }

    const handleSubmitTraining = (submission) => {
        const newSubmission = {
            ...submission,
            id: `SUB-${Date.now()}`,
            timestamp: new Date().toISOString()
        }
        setPendingSubmissions([...pendingSubmissions, newSubmission])
    }

    const handleApproveSubmission = (submissionId) => {
        const submission = pendingSubmissions.find(s => s.id === submissionId)
        if (!submission) return

        const newList = inspectors.map(inspector => {
            if (inspector.id === submission.inspectorId) {
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

                return { ...inspector, trainingLog: updatedTrainingLog }
            }
            return inspector
        })

        setInspectors(newList)
        setPendingSubmissions(pendingSubmissions.filter(s => s.id !== submissionId))
    }

    const handleRejectSubmission = (submissionId) => {
        setPendingSubmissions(pendingSubmissions.filter(s => s.id !== submissionId))
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', overflow: 'hidden' }}>
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                pendingCount={pendingSubmissions.length}
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
    )
}

export default App
