'use client'

import { useEffect, useState } from 'react'

type LoaderState = {
  isLoaded: boolean
  error?: any
}

let googleMapsPromise: Promise<void> | null = null

export function useGoogleMapsLoader(): LoaderState {
  const [state, setState] = useState<LoaderState>({ isLoaded: false })

  useEffect(() => {
    // If already loaded, just set state
    if (typeof window !== 'undefined' && (window as any).google?.maps) {
      setState({ isLoaded: true })
      return
    }

    // If already loading, attach to existing promise
    if (!googleMapsPromise) {
      googleMapsPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}&libraries=core,maps,places,marker&v=weekly`
        script.async = true
        script.onload = () => resolve()
        script.onerror = (e) => reject(e)
        document.head.appendChild(script)
      })
    }

    googleMapsPromise
      .then(() => setState({ isLoaded: true }))
      .catch((error) => setState({ isLoaded: false, error }))
  }, [])

  return state
}