import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { parseInspectorExcel } from '../utils/ExcelImport';
import { bulkAddInspectors } from '../services/firebaseService';

function BulkImportModal({ isOpen, onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            setIsLoading(true);
            try {
                const data = await parseInspectorExcel(selectedFile);
                setPreviewData(data);
            } catch (err) {
                setError(err.message || "Failed to parse Excel file. Please ensure it follows the correct format.");
                console.error("Excel Parsing Error:", err);
                setFile(null);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpload = async () => {
        if (!previewData.length) return;
        setIsLoading(true);
        try {
            await bulkAddInspectors(previewData);
            onSuccess();
            onClose();
        } catch (err) {
            setError("Failed to upload data to database.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card"
                style={{
                    width: '800px',
                    maxHeight: '90vh',
                    display: 'flex', flexDirection: 'column',
                    border: '1px solid var(--accent-cyan)',
                    background: '#1a1a1a'
                }}
            >
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FileSpreadsheet color="var(--accent-emerald)" size={24} />
                        <h2 className="hud-text" style={{ fontSize: '1.2rem', color: '#fff' }}>BULK DATA IMPORT</h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '30px', flex: 1, overflowY: 'auto' }}>
                    {!file ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: '2px dashed rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                padding: '60px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: 'rgba(255,255,255,0.02)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                        >
                            <Upload size={48} color="var(--accent-cyan)" style={{ marginBottom: '20px' }} />
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Drag & Drop or Click to Upload</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Supports .xlsx files (Max 5MB)</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".xlsx, .xls"
                                style={{ display: 'none' }}
                            />
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>File: {file.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{previewData.length} records found</p>
                                </div>
                                <button
                                    onClick={() => { setFile(null); setPreviewData([]); }}
                                    style={{ color: 'var(--accent-red)', background: 'transparent', border: '1px solid var(--accent-red)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    Change File
                                </button>
                            </div>

                            {/* Preview Table */}
                            {previewData.length > 0 && (
                                <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>NAME</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>ROLE</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>DOMAIN</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.slice(0, 5).map((row, idx) => (
                                                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '10px' }}>{row.id}</td>
                                                    <td style={{ padding: '10px' }}>{row.name}</td>
                                                    <td style={{ padding: '10px' }}>{row.role}</td>
                                                    <td style={{ padding: '10px' }}>{row.domain}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {previewData.length > 5 && (
                                        <div style={{ padding: '10px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                            ...and {previewData.length - 5} more rows
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255, 59, 48, 0.1)', border: '1px solid var(--accent-red)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <AlertCircle color="var(--accent-red)" size={20} />
                            <span style={{ color: 'var(--accent-red)', fontSize: '0.9rem' }}>{error}</span>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={!previewData.length || isLoading}
                        style={{
                            padding: '10px 25px',
                            background: !previewData.length ? 'gray' : 'var(--accent-emerald)',
                            border: 'none',
                            color: '#000',
                            fontWeight: 'bold',
                            borderRadius: '4px',
                            cursor: !previewData.length ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        {isLoading ? <Loader2 className="spin" size={18} /> : <Upload size={18} />}
                        {isLoading ? 'UPLOADING...' : 'CONFIRM UPLOAD'}
                    </button>
                </div>
            </motion.div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export default BulkImportModal;
