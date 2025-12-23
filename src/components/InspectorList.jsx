import React, { useState } from 'react'
import { subdirectorates, domains } from '../data/mockData'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ChevronRight, User, Terminal } from 'lucide-react'

function InspectorList({ inspectors, onSelectInspector }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterSub, setFilterSub] = useState('All')
    const [filterDomain, setFilterDomain] = useState('All')

    const filteredInspectors = inspectors.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSub = filterSub === 'All' || item.subdirectorate === filterSub
        const matchesDomain = filterDomain === 'All' || item.domain === filterDomain
        return matchesSearch && matchesSub && matchesDomain
    })

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ marginBottom: '3rem' }}>
                <p className="hud-text" style={{ fontSize: '0.7rem' }}>Database // Personnel</p>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, textTransform: 'uppercase' }}>Fleet Personnel</h1>
            </header>

            <div className="technical-border" style={{ background: 'rgba(0, 212, 255, 0.03)', marginBottom: '3rem', padding: '20px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                        <Terminal size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-cyan)' }} />
                        <input
                            type="text"
                            placeholder="SEARCH BY NAME OR UNIT-ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 40px',
                                background: 'rgba(0, 0, 0, 0.3)',
                                border: '1px solid var(--surface-border)',
                                color: 'var(--accent-cyan)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                outline: 'none',
                                letterSpacing: '0.05em'
                            }}
                        />
                    </div>

                    <select
                        value={filterSub}
                        onChange={(e) => setFilterSub(e.target.value)}
                        style={{
                            padding: '12px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid var(--surface-border)',
                            color: 'var(--accent-cyan)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            outline: 'none',
                            minWidth: '200px'
                        }}
                    >
                        <option value="All">ALL SUBDIRECTORATE</option>
                        {subdirectorates.map(sub => <option key={sub} value={sub}>{sub.toUpperCase()}</option>)}
                    </select>

                    <select
                        value={filterDomain}
                        onChange={(e) => setFilterDomain(e.target.value)}
                        style={{
                            padding: '12px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid var(--surface-border)',
                            color: 'var(--accent-cyan)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            outline: 'none',
                            minWidth: '200px'
                        }}
                    >
                        <option value="All">ALL DOMAINS</option>
                        {domains.map(dom => <option key={dom} value={dom}>{dom.toUpperCase()}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '30px' }}>
                <AnimatePresence>
                    {filteredInspectors.map((inspector) => (
                        <motion.div
                            key={inspector.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => onSelectInspector(inspector)}
                            className="glass-card"
                            style={{ padding: '0', cursor: 'pointer', overflow: 'hidden', borderLeft: '4px solid var(--accent-cyan)' }}
                        >
                            <div style={{ padding: '1.5rem', background: 'rgba(0, 212, 255, 0.03)', borderBottom: '1px solid var(--surface-border)' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img src={inspector.avatar} alt="" style={{ width: '80px', height: '80px', border: '1px solid var(--accent-cyan)', filter: 'grayscale(0.5)' }} />
                                        <div className="rivet" style={{ top: '2px', left: '2px' }} />
                                        <div className="rivet" style={{ top: '2px', right: '2px' }} />
                                        <div className="rivet" style={{ bottom: '2px', left: '2px' }} />
                                        <div className="rivet" style={{ bottom: '2px', right: '2px' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p className="hud-text" style={{ fontSize: '0.55rem', opacity: 0.6 }}>ID: {inspector.id}</p>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>{inspector.name}</h3>
                                        <p className="hud-text" style={{ fontSize: '0.65rem', color: 'var(--accent-amber)' }}>{inspector.role}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                    <div>
                                        <p className="hud-text" style={{ fontSize: '0.5rem', marginBottom: '4px' }}>Division</p>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{inspector.subdirectorate.toUpperCase()}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p className="hud-text" style={{ fontSize: '0.5rem', marginBottom: '4px' }}>Status</p>
                                        <p className="hud-text" style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>ACTIVE</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span className="hud-text" style={{ fontSize: '0.55rem' }}>Formal</span>
                                            <span className="hud-text" style={{ fontSize: '0.55rem' }}>{inspector.stats.formal}%</span>
                                        </div>
                                        <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                                            <div style={{ width: `${inspector.stats.formal}%`, height: '100%', background: 'var(--accent-cyan)', boxShadow: '0 0 8px var(--accent-cyan)' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span className="hud-text" style={{ fontSize: '0.55rem' }}>Field OJT</span>
                                            <span className="hud-text" style={{ fontSize: '0.55rem' }}>{inspector.stats.ojt}%</span>
                                        </div>
                                        <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                                            <div style={{ width: `${inspector.stats.ojt}%`, height: '100%', background: 'var(--accent-amber)', boxShadow: '0 0 8px var(--accent-amber)' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default InspectorList
