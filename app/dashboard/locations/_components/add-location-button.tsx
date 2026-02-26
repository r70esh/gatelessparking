'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import React, { useState } from 'react'
import AddLocationDialog from './add-location-dialog'
import { cn } from '@/lib/utils'

function AddLocationButton() {
    const [open, setOpen] = useState(false)

    return (
        <div className="relative">
            <div className="flex flex-col">
                <Button 
                    onClick={() => setOpen(true)}
                    // Custom styles to ensure visibility and theme matching
                    className={cn(
                        "self-end h-12 px-6 rounded-xl font-bold transition-all duration-300",
                        "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20",
                        "border border-purple-400/20 active:scale-95 flex items-center justify-center"
                    )}
                >
                    <PlusIcon className='mr-2 w-5 h-5' strokeWidth={2.5} />
                    <span className="text-white">Add Location</span>
                </Button>

                {/* location add dialog */}
                <AddLocationDialog open={open} setOpen={setOpen} />
            </div>
        </div>
    )
}

export default AddLocationButton