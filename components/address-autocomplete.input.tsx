import { LatLng } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'
import { libs } from '@/lib/utils'
import { Input } from './ui/input'

type AddressAutoCompleteInputProps = {
    onAddressSelect: (address: string, gpscoords: LatLng) => void,
    selectedAddress?: string
}   

function AddressAutoCompleteInput({
    onAddressSelect, selectedAddress
} : AddressAutoCompleteInputProps) {

    const [autoComplete, setAutoComplete] = 
    useState<google.maps.places.Autocomplete | null>(null)

    const { isLoaded } = useJsApiLoader({
        nonce: "477d4456-f7b5-45e2-8945-5f17b3964752",
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY!,
        libraries: libs
    })

    const placesAutoCompleteRef = useRef<HTMLInputElement>(null)

    useEffect(() => {

        if (isLoaded && placesAutoCompleteRef.current) {
            // Bounds roughly covering Nepal
            const nepalBounds = new google.maps.LatLngBounds(
                new google.maps.LatLng({ lat: 26.347, lng: 80.058 }), // south west
                new google.maps.LatLng({ lat: 30.447, lng: 88.201 })  // north east
            )

            const gAutoComplete = new google.maps.places.Autocomplete(
                placesAutoCompleteRef.current, 
                {
                    bounds: nepalBounds,
                    fields: ['formatted_address', 'geometry'],
                    componentRestrictions: { country: ['np'] } // restrict to Nepal
                }
            )

            gAutoComplete.addListener('place_changed', () => {
                const place = gAutoComplete.getPlace()
                const position = place.geometry?.location
                if (position && place.formatted_address) {
                    onAddressSelect(place.formatted_address, {
                        lat: position.lat(),
                        lng: position.lng()
                    })
                }
            })

            setAutoComplete(gAutoComplete)
        }
    }, [isLoaded, onAddressSelect])

    useEffect(() => {
        // Disable Radix UI dialog pointer events lockout
        setTimeout(() => (document.body.style.pointerEvents = ""), 0)
    }, [])

    return (
        <Input ref={placesAutoCompleteRef} defaultValue={selectedAddress} />
    )
}

export default AddressAutoCompleteInput
