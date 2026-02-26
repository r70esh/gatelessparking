'use client'

import React, { useCallback } from 'react'

function Timeline() {
    const timeslots = useCallback(() => {
        const formatTime = (hour: number) => {
            const period = hour >= 12 ? 'PM' : 'AM'
            const displayHour = hour % 12 === 0 ? 12 : hour % 12
            return { time: displayHour, period }
        }
    
        const generateTimeSlots = () => {
            const slots = []
            // We only show labels for every 2 hours to keep it spacious
            for (let hour = 0; hour < 24; hour += 2) {
                slots.push({ ...formatTime(hour), index: hour })
            }
            return slots
        }
    
        return generateTimeSlots()
    }, [])

    return (
        /* 1. Removing purple background, using absolute positioning with better spacing */
        <div className='absolute top-6 flex items-center w-full'>
            {timeslots().map((slot) => (
                <div 
                    key={slot.index} 
                    className='absolute transition-opacity duration-500' 
                    /* Note: 80px here matches the '40px' increment 
                       from the TimelineTicks component (2 ticks per hour) 
                    */
                    style={{ left: `${80 * slot.index}px` }}
                >
                    <div className="flex flex-col items-center -translate-x-1/2">
                        <p className="text-[11px] font-black text-slate-900 tracking-tighter uppercase">
                            {slot.time}
                            <span className="ml-0.5 text-[9px] text-slate-400 font-medium">
                                {slot.period}
                            </span>
                        </p>
                        
                        {/* A tiny indicator dot to tie the label to the line below */}
                        <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1 opacity-40" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Timeline