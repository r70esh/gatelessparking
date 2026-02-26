'use client'

import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { FormControl } from './ui/form'
import { getTimeSlots, type ReturnType } from '@/lib/utils' // Import the type
import { cn } from '@/lib/utils'


type TimeSelectProps = {
    onChange: (value: string) => void
    defaultValue?: string
    disableTime?: string // Usually the "Arriving Time" to prevent earlier "Leaving Time"
}

export default function TimeSelect({ onChange, defaultValue, disableTime }: TimeSelectProps) {
    // Standardizing date comparison to 2000-01-01 to ignore dates and focus on clock time
    const disabledDate = disableTime ? new Date(`2000-01-01T${disableTime}:00`) : null

    return (
        <Select value={defaultValue} onValueChange={onChange}>
            <FormControl>
                <SelectTrigger
                    className={cn(
                        "bg-transparent border border-gray-300 rounded-lg px-3 py-2 text-left w-full",
                        "focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all",
                        !defaultValue && "text-gray-400"
                    )}
                >
                    <SelectValue placeholder="Select a time" />
                </SelectTrigger>
            </FormControl>

            <SelectContent className="bg-white rounded-lg shadow-xl p-1 max-h-60 overflow-y-auto z-[100]">
                {/* Explicitly typed 'time' as ReturnType */}
                {getTimeSlots().map((time: ReturnType) => {
                    const currentTime = new Date(`2000-01-01T${time.time}:00`)
                    
                    // Logic: If this is the 'Leaving Time' selector, disable any time 
                    // that is equal to or before the 'Arriving Time'
                    const isDisabled = disabledDate ? currentTime <= disabledDate : false
                    
                    return (
                        <SelectItem
                            key={time.time}
                            value={time.time}
                            disabled={isDisabled}
                            className={cn(
                                "px-3 py-2 rounded-md transition-colors cursor-pointer focus:bg-purple-100",
                                isDisabled && "opacity-50 grayscale cursor-not-allowed bg-slate-50"
                            )}
                        >
                            {time.display}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )
}