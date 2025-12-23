import React from 'react'
import { subdirectorates } from '../data/mockData'
import { motion } from 'framer-motion'
import { Activity, BookOpen, CheckCircle, Clock, Target, ShieldCheck } from 'lucide-react'
import Gauge from './Gauge'

function Dashboard({ inspectors, onSelectInspector }) {
    const totalInspectors = inspectors.length
    const avgFormal = totalInspectors > 0
        ? Math.round(inspectors.reduce((acc, curr) => acc + curr.stats.formal, 0) / totalInspectors)
        : 0
    const avgOjt = totalInspectors > 0
        ? Math.round(inspectors.reduce((acc, curr) => acc + curr.stats.ojt, 0) / totalInspectors)
        : 0

    const stats = [
        { label: 'Personnel Active', value: totalInspectors < 10 ? `0${totalInspectors}` : totalInspectors, icon: Activity, color: 'var(--accent-cyan)' },
        { label: 'Pending Approvals', value: '04', icon: Clock, color: 'var(--accent-red)' },
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative' }}
        >
            {/* HUD Coordinate Markers */}
            <div className="hud-text" style={{ position: 'absolute', top: '-10px', left: '-10px', fontSize: '0.6rem', opacity: 0.4 }}>LAT: 06°12'S</div>
            <div className="hud-text" style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '0.6rem', opacity: 0.4 }}>LNG: 106°49'E</div>

            <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <p className="hud-text" style={{ fontSize: '0.7rem', color: 'var(--accent-amber)' }}>[ SECURE CONNECTION ESTABLISHED ]</p>
                        <h1 style={{ fontSize: '3rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.02em', background: 'linear-gradient(to bottom, #fff, #88a0b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Command Center
                        </h1>
                    </div>
                    <div className="technical-border" style={{ padding: '8px 16px' }}>
                        <p className="hud-text" style={{ fontSize: '0.6rem' }}>System-ID: DGCA-FLT-OPS</p>
                        <p className="hud-text" style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>STABLE</p>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '3rem' }}>
                {/* Instrument Gauges */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <h3 className="hud-text" style={{ fontSize: '0.7rem', alignSelf: 'flex-start' }}>01. Formal Training Readiness</h3>
                    <Gauge value={avgFormal} size={160} color="var(--accent-cyan)" label="SYSTEM AVG" />
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compliance Index</p>
                        <p className="hud-text" style={{ color: 'var(--accent-emerald)' }}>OPTIMAL</p>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <h3 className="hud-text" style={{ fontSize: '0.7rem', alignSelf: 'flex-start' }}>02. OJT Completion Progress</h3>
                    <Gauge value={avgOjt} size={160} color="var(--accent-amber)" label="FIELD OPS" />
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Proficiency Level</p>
                        <p className="hud-text" style={{ color: 'var(--accent-emerald)' }}>STABLE</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div key={index} className="glass-card" style={{ padding: '1.5rem', flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p className="hud-text" style={{ fontSize: '0.6rem', marginBottom: '8px' }}>{stat.label}</p>
                                        <h3 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: stat.color }}>{stat.value}</h3>
                                    </div>
                                    <Icon size={32} color={stat.color} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-emerald)' }}>
                    <h2 className="hud-text" style={{ fontSize: '0.9rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Target size={18} /> Subdirectorate Resource Distribution
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {subdirectorates.map(sub => {
                            const count = inspectors.filter(i => i.subdirectorate === sub).length
                            const percentage = totalInspectors > 0 ? (count / totalInspectors) * 100 : 0
                            return (
                                <div key={sub}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{sub.toUpperCase()}</span>
                                        <span className="hud-text" style={{ fontSize: '0.65rem' }}>{count} PC</span>
                                    </div>
                                    <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.03)', position: 'relative' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            style={{ height: '100%', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)' }}
                                        />
                                        <div style={{ position: 'absolute', right: 0, top: '-10px', bottom: '-10px', width: '2px', background: 'rgba(255,255,255,0.1)' }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-amber)' }}>
                    <h2 className="hud-text" style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>System Log / Feed</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {inspectors.slice(0, 4).map(insp => (
                            <div key={insp.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                                <div style={{ width: '8px', height: '8px', background: 'var(--accent-emerald)', borderRadius: '50%', boxShadow: '0 0 5px var(--accent-emerald)' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{insp.name.toUpperCase()}</p>
                                    <p className="hud-text" style={{ fontSize: '0.55rem', opacity: 0.6 }}>OJT ENTRY COMPLETED // RADAR-ID: {insp.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default Dashboard
