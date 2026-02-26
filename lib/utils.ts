import { Booking } from "@/schemas/booking"
import { Library } from "@googlemaps/js-api-loader"
import { type ClassValue, clsx } from "clsx"
import { compareAsc, differenceInMinutes, getHours, getMinutes, isValid } from "date-fns"
import { twMerge } from "tailwind-merge"

export const libs: Library[] = ['core', 'maps', 'places', 'marker']

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Formatting Utilities ---

export function formatAmountForDisplay(amount: number, currency: string): string {
  if (isNaN(amount)) return ''
  if (currency === 'NPR') {
    return `Rs. ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: "NPR" }).format(amount)
}

export function formatAmountForStripe(amount: number, currency: string): number {
  const numberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
  const parts = numberFormat.formatToParts(amount)
  const isZeroDecimal = !parts.some(part => part.type === 'decimal')
  return isZeroDecimal ? amount : Math.round(amount * 100)
}

export function getStreetFromAddress(address: string) {
  if (!address) return ''
  return address.split(',')[0]
}

// --- Time Utilities ---

export type ReturnType = { time: string; display: string }

export function getTimeSlots(startTime = "00:00", endTime = "23:45"): ReturnType[] {
  const timeArray: ReturnType[] = []
  const parsedStartTime = new Date(`2000-01-01T${startTime}:00`)
  const parsedEndTime = new Date(`2000-01-01T${endTime}:00`)
  let currentTime = parsedStartTime

  while (currentTime <= parsedEndTime) {
    const hours = currentTime.getHours().toString().padStart(2, "0")
    const minutes = currentTime.getMinutes().toString().padStart(2, "0")
    const hourNum = currentTime.getHours()
    const ampm = hourNum < 12 ? "AM" : "PM"
    const displayHour = hourNum % 12 || 12
    timeArray.push({
      time: `${hours}:${minutes}`,
      display: `${displayHour}:${minutes} ${ampm}`
    })
    currentTime.setMinutes(currentTime.getMinutes() + 30)
  }
  return timeArray
}

// --- Timeline Rendering Utilities ---

export function sortcomparer(b1: Booking, b2: Booking) {
  return compareAsc(new Date(b1.starttime), new Date(b2.starttime))
}

export function blockLength(starttime: Date | string, endtime: Date | string) {
  const start = new Date(starttime), end = new Date(endtime)
  return isValid(start) && isValid(end) ? differenceInMinutes(end, start) : 0
}

export function blockPostion(starttime: Date | string) {
  const start = new Date(starttime)
  if (!isValid(start)) return 0
  return (getHours(start) * 60) + getMinutes(start)
}

// --- Google Maps Content Builders ---

export const buildMapInfoCardContent = (title: string, address: string, totalSpots: number, price: number): string => {
  return `
    <div class="map_infocard_content">
      <div class="map_infocard_title">${title}</div>
      <div class="map_infocard_body">
        <div>${address}</div>
        <hr />
        <div>Total spots: ${totalSpots}</div>
        <div>Price: ${formatAmountForDisplay(price, 'NPR')}/hr</div>
      </div>
    </div>`
}

export const buildMapInfoCardContentForDestination = (title: string, address: string): string => {
  return `
  <div class="map_infocard_content">
      <div class="map_infocard_title">${title}</div>
      <div class="map_infocard_body"><div>${address}</div></div>
  </div>`
}

// --- Google Maps Custom Pin Builders ---

export const parkingPin = (type: string) => {
  if (typeof window === 'undefined') return null
  const glyphImg = document.createElement('div')
  glyphImg.innerHTML = `<div class="map_pin_container"><img src="/${type}.png" /></div>`
  return new google.maps.marker.PinElement({ glyph: glyphImg })
}

export const parkingPinWithIndex = (type: string, index: number) => {
  if (typeof window === 'undefined') return null
  const glyphImg = document.createElement('div')
  glyphImg.innerHTML = `
    <div class="map_pin_container">
      <div class="map_pin_id"><span>${index}</span></div>
      <img src="/${type}.png" />
    </div>`
  return new google.maps.marker.PinElement({ glyph: glyphImg })
}

export const destinationPin = (type: string) => {
  if (typeof window === 'undefined') return null
  const glyphImg = document.createElement('img')
  glyphImg.src = `/${type}.png`
  return new google.maps.marker.PinElement({ glyph: glyphImg })
}