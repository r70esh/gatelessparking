'use client'

import React, { useState } from 'react'
import SearchForm from './search-form'
import Map from './map'
import SearchResult from './search-result'
import { LatLng, MapAddressType, MapParams } from '@/types'
import { findNearbyLocations } from '@/actions/actions'
import { ParkingLocation } from '@/schemas/parking-locations'

export type SearchParams = {
  address: string
  gpscoords: LatLng
  arrivingon: string
  arrivingtime: string
  leavingtime: string
}

export default function SearchComponent() {
  const [search, setSearch] = useState<MapParams[]>([])
  const [searchRadius] = useState(1000) // Increased radius slightly for better UX
  const [message, setMessage] = useState("Enter an address, date, time and click search")
  const [searchParams, setSearchParams] = useState<SearchParams | undefined>()

  const handleSearchDone = async (params: SearchParams) => {
    setMessage("Searching for available spots...")
    setSearch([])

    // The server action now calculates occupancy based on the requested time range
    const searchResult = await findNearbyLocations(searchRadius, params)

    const mapParams: MapParams[] = searchResult.map((loc: any) => ({
      address: loc.address,
      gpscoords: loc.gpscoords,
      price: loc.price,
      numberofspots: loc.numberofspots,
      bookedspots: loc.bookedspots,
      availablespots: loc.availablespots, // New field from our updated server action
      status: loc.status, // Will be "FULL" if availablespots <= 0
      type: MapAddressType.PARKINGLOCATION,
      id: loc._id
    }))

    if (mapParams.length > 0) {
      // Add the destination pin (user's target address) to the start of the array
      mapParams.unshift({
        address: params.address,
        gpscoords: params.gpscoords,
        type: MapAddressType.DESTINATION,
        radius: searchRadius,
        id: "destination"
      })

      setSearch([...mapParams])
      setSearchParams(params)
    } else {
      setMessage("No nearby parking locations found for this time slot.")
    }
  }

  return (
    <div className="relative z-30 w-full max-w-7xl mx-auto px-4 md:px-6 -mt-28">
      
      {/* Unified Search Form Tile */}
      <div className="glassy-black p-2 md:p-4 rounded-[2.5rem] shadow-2xl shadow-black/50 mb-10">
        <SearchForm onSearch={handleSearchDone} />
      </div>

      {search.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-6 w-full animate-in fade-in slide-in-from-top-4 duration-500 pb-20">
          
          {/* Result Sidebar - Shows the list of locations with availability */}
          <div className="w-full lg:w-96 h-[600px] overflow-auto rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/10 p-2 scrollbar-hide">
            <SearchResult 
                locations={search} 
                params={searchParams as SearchParams} 
            />
          </div>

          {/* Map Container - Shows pins. Markers should change color if FULL */}
          <div className="flex-1 h-[600px] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900">
            <Map mapParams={JSON.stringify(search)} />
          </div>
        </div>
      ) : (
        <div className="text-center py-20 glassy-black rounded-[3rem] border border-dashed border-white/10">
          <p className="text-xl text-slate-500 font-medium">{message}</p>
        </div>
      )}
    </div>
  )
}