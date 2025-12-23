import React from 'react'
import { motion } from 'framer-motion'

function Gauge({ value, size = 120, color = 'var(--accent-cyan)', label = '' }) {
    const radius = (size - 20) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (value / 100) * circumference

    return (
        <div style={{ position: 'relative', width: size, height: size, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                {/* Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="8"
                />
                {/* Progress */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 5px ${color})` }}
                />

                {/* Scale Ticks */}
                {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180
                    const x1 = size / 2 + (radius - 5) * Math.cos(angle)
                    const y1 = size / 2 + (radius - 5) * Math.sin(angle)
                    const x2 = size / 2 + (radius + 5) * Math.cos(angle)
                    const y2 = size / 2 + (radius + 5) * Math.sin(angle)
                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="rgba(255, 255, 255, 0.2)"
                            strokeWidth="1"
                        />
                    )
                })}
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color }}>{value}%</span>
                {label && <p className="hud-text" style={{ fontSize: '0.45rem', marginTop: '2px', opacity: 0.7 }}>{label}</p>}
            </div>
        </div>
    )
}

export default Gauge
