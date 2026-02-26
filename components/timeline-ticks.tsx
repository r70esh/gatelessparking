'use client'

import React, { useCallback } from 'react'

function TimelineTicks() {

    const markers = useCallback(() => {
        const markers = []
        const increment = 30
        const totalMarkers = 23.5 * (60 / increment)
    
        for (let i = 0; i <= totalMarkers; i++) {
            const isHourMarker = i % 2 === 0
            const isQuarterDay = i % 12 === 0 // Every 6 hours
            const leftPosition = i * 40 // Increased spacing for "breathing room"
    
            markers.push(
                <div 
                    key={i} 
                    className={`absolute transition-all duration-300 rounded-full
                        ${isQuarterDay ? 'w-1 h-10 bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 
                          isHourMarker ? 'w-[1.5px] h-7 bg-slate-400' : 
                          'w-px h-4 bg-slate-200'}
                    `}
                    style={{ left: `${leftPosition}px` }}
                >
                    {/* Time Label for Hour Markers */}
                    {isHourMarker && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500 tracking-tighter">
                            {Math.floor(i / 2)}:00
                        </span>
                    )}
                </div>
            )
        }

        return markers
    }, [])

    return (
        <div className='relative w-full h-24 mt-12 flex items-center border-b border-slate-100 overflow-x-auto no-scrollbar'>
            {/* Soft Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white pointer-events-none z-10" />
            
            <div className='relative h-full flex items-center'>
                {markers()}
            </div>
        </div>
    )
}

export default TimelineTicks