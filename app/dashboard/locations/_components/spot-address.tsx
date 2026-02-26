'use client'

import AddressAutoCompleteInput from '@/components/address-autocomplete.input'
import { Button } from '@/components/ui/button'
import { useMySpotStore } from '@/store'
import { LatLng, ListSpotPropsType } from '@/types'
import React, { useState } from 'react'
import { ArrowRight, MapPin } from 'lucide-react'

function SpotAddress({ onNext }: ListSpotPropsType) {
    const mySpotStore = useMySpotStore()
    const [message, setMessage] = useState<string>("")

    function onSubmit() {
        if (mySpotStore.data.address) {
            onNext()
        } else {
            setMessage("Please select a valid address from the suggestions.")
        }
    }

    const handleAddressSelect = (address: string, gpscoords: LatLng) => {
        setMessage('')
        mySpotStore.updateState({
            address: address,
            gpscoords: gpscoords
        })
    }

    return (
        <div className="grid w-full gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Location
                </h2>
                <p className="text-sm text-slate-400">
                    Where is your parking spot located?
                </p>
            </div>

            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 mb-[-10px]">
                    <MapPin size={14} className="text-purple-400" />
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Search Street Address
                    </label>
                </div>
                
                {/* Ensure the child input has text-white classes internally */}
                <AddressAutoCompleteInput 
                    onAddressSelect={handleAddressSelect} 
                    selectedAddress={mySpotStore.data.address} 
                />
                
                {message && (
                    <p className='text-red-400 text-xs font-medium animate-pulse'>
                        {message}
                    </p>
                )}
            </div>

            <div className="flex justify-end pt-8">
                <Button 
                    type='button' 
                    onClick={onSubmit}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-10 h-12 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all active:scale-95"
                >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

export default SpotAddress