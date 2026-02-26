'use client'

import { 
    buildMapInfoCardContent, 
    buildMapInfoCardContentForDestination, 
    destinationPin, 
    getStreetFromAddress, 
    libs, 
    parkingPin, 
    parkingPinWithIndex 
} from "@/lib/utils"
import { MapAddressType, MapParams } from "@/types"
import { useJsApiLoader } from "@react-google-maps/api"
import { useEffect, useRef } from "react"

function Map({ mapParams }: { mapParams: string}) {
    // Parse the JSON string into objects
    const params = JSON.parse(mapParams) as MapParams[]
    
    // Use a ref for the infoWindow to keep it persistent across renders
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

    const { isLoaded } = useJsApiLoader({
        nonce: "477d4456-f7b5-45e2-8945-5f17b3964752",
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
        libraries: libs
    })

    const mapRef = useRef<HTMLDivElement>(null)

    const getPinType = (loc: MapParams): string => {
        return loc.type === MapAddressType.DESTINATION ? 'parking_destination_tr' : 'parking_pin_tr'
    }

    useEffect(() => {
        if (isLoaded && mapRef.current && params.length > 0) {
            const mapOptions: google.maps.MapOptions = {
                center: {
                    lat: params[0]?.gpscoords?.lat ?? 27.7172,
                    lng: params[0]?.gpscoords?.lng ?? 85.3240
                },
                zoom: 14,
                mapId: 'MY-MAP-ID-1234' // Ensure this matches your Google Cloud Console Map ID
            }

            const gMap = new google.maps.Map(mapRef.current, mapOptions)
            infoWindowRef.current = new google.maps.InfoWindow({ maxWidth: 200 })
            
            setMarkers(gMap)
        }
    }, [isLoaded, mapParams]) // Re-run if mapParams change

    function setMarkers(map: google.maps.Map) {
        params.forEach((loc, index) => {
            if (!loc.gpscoords) return;

            const position = {
                lat: loc.gpscoords.lat,
                lng: loc.gpscoords.lng
            }

            const marker = new google.maps.marker.AdvancedMarkerElement({
                map: map,
                position: position,
                title: loc.address
            })

            // Fix "Object is possibly null" by using optional chaining and element extraction
            if (loc.type === MapAddressType.PARKINGLOCATION) {
                marker.setAttribute("content", buildMapInfoCardContent(
                    getStreetFromAddress(loc.address),
                    loc.address,
                    loc.numberofspots as number,
                    loc.price?.hourly as number
                ))
                // Use ?.element to safely handle the null return from our utility
                const pin = parkingPinWithIndex(getPinType(loc), index)
                if (pin) marker.content = pin.element

            } else if (loc.type === MapAddressType.ADMIN) {
                marker.setAttribute("content", buildMapInfoCardContent(
                    getStreetFromAddress(loc.address),
                    loc.address,
                    loc.numberofspots as number,
                    loc.price?.hourly as number
                ))
                const pin = parkingPin(getPinType(loc))
                if (pin) marker.content = pin.element

            } else {
                // For destination type (The search center)
                new google.maps.Circle({
                    strokeColor: '#A855F7', // Purple to match your UI
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#A855F7',
                    fillOpacity: 0.2,
                    map,
                    center: position,
                    radius: loc.radius ?? 500
                })

                const pin = destinationPin(getPinType(loc))
                if (pin) marker.content = pin.element
                
                marker.setAttribute("content", buildMapInfoCardContentForDestination(
                    getStreetFromAddress(loc.address),
                    loc.address
                ))
            }

            marker.addListener('click', () => {
                const iWindow = infoWindowRef.current
                if (iWindow) {
                    iWindow.close()
                    iWindow.setContent(marker.getAttribute('content') || '')
                    iWindow.open({
                        map,
                        anchor: marker
                    })
                }
            })
        })
    }

    return (
        <div className="w-full h-full min-h-[600px] rounded-[2rem] overflow-hidden">
            {!isLoaded ? (
                <div className="flex items-center justify-center h-full bg-slate-900 text-white">
                    <p className="animate-pulse">Loading Map...</p>
                </div>
            ) : (
                <div className="h-full w-full" ref={mapRef} />
            )}
        </div>
    )
}

export default Map