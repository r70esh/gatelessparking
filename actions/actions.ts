'use server'

import EmailTemplate from "@/components/email-template"
import { SearchParams } from "@/components/search-component"
import ViolationEmailTemplate from "@/components/violation-email-template"
import { connectToDB } from "@/lib/db"
import { Booking, BookingModel } from "@/schemas/booking"
import { ParkingLocation, ParkingLocationModel } from "@/schemas/parking-locations"
import { ActionResponse, BookingStatus, ParkingLocationStatus, UpdateLocationParams } from "@/types"
import { currentUser } from "@clerk/nextjs/server"
import { compareAsc, format, formatDate, startOfDay, endOfDay } from "date-fns"
import { revalidatePath } from "next/cache"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Toggle location availability
 */
export async function toggleLocation({ id, path }: { id: string, path: string }) {
    await connectToDB()
    const location = await ParkingLocationModel.findById<ParkingLocation>(id)

    if (location) {
        location.status = location.status === ParkingLocationStatus.AVAILABLE
            ? ParkingLocationStatus.NOTAVAILABLE : ParkingLocationStatus.AVAILABLE

        await location.save()
        revalidatePath(path)
    }
}

/**
 * Delete a parking location
 */
export async function deleteLocation({ id, path }: { id: string, path: string }) {
    await connectToDB()
    const deleteResult = await ParkingLocationModel.findByIdAndDelete(id)
    if (deleteResult) {
        revalidatePath(path)
    }
}

/**
 * Update location details
 */
export async function updateLocation({ id, path, location }: { id: string, path: string, location: UpdateLocationParams }) {
    try {
        await connectToDB()
        await ParkingLocationModel.updateOne({ _id: id }, { $set: location })
        revalidatePath(path)
    } catch (error) {
        console.error(error)
        throw error
    }
}

/**
 * Find nearby locations and check availability for specific time slots
 */
export async function findNearbyLocations(maxDistance: number, searchParams: SearchParams) {
    try {
        await connectToDB()

        const st = new Date(`${searchParams.arrivingon}T${searchParams.arrivingtime}`)
        const et = new Date(`${searchParams.arrivingon}T${searchParams.leavingtime}`)

        const parkingLocations: ParkingLocation[] = await ParkingLocationModel.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [searchParams.gpscoords.lng, searchParams.gpscoords.lat]
                    },
                    $maxDistance: maxDistance
                }
            }
        }).lean()

        const availableLocations = await Promise.all(parkingLocations.map(async (location: ParkingLocation) => {
            const bookings = await BookingModel.find({
                locationid: location._id,
                status: BookingStatus.BOOKED,
                starttime: { $lt: et },
                endtime: { $gt: st }
            }).lean()

            const bookedCount = bookings.length
            if (bookedCount < location.numberofspots) {
                return { ...location, bookedspots: bookedCount }
            } else {
                return { ...location, bookedspots: bookedCount, status: ParkingLocationStatus.FULL }
            }
        }))

        return JSON.parse(JSON.stringify(availableLocations))
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getParkingLocation(id: string) {
    try {
        await connectToDB()
        const location = await ParkingLocationModel.findById<ParkingLocation>(id)
        return JSON.parse(JSON.stringify(location))
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getParkingLocations() {
    try {
        await connectToDB()
        const locations = await ParkingLocationModel.find<ParkingLocation>({})
        return JSON.parse(JSON.stringify(locations))
    } catch (error) {
        console.error(error)
        throw error
    }
}

/**
 * Send booking confirmation email
 */
export async function sendConfirmationEmail(bookingid: string): Promise<ActionResponse> {
    try {
        const user = await currentUser()
        if (!user) throw new Error('You must be logged in')

        await connectToDB()
        const booking = await BookingModel.findById<Booking>(bookingid).populate({
            path: 'locationid', model: ParkingLocationModel
        }).lean()

        if (booking) {
            const { error } = await resend.emails.send({
                from: "Gateless Parking <booking@grepsoft.com>",
                to: user.primaryEmailAddress?.emailAddress!,
                subject: "Your booking has been confirmed",
                react: EmailTemplate({
                    firstName: user?.firstName!,
                    bookingDate: formatDate(booking.bookingdate, 'MMM dd, yyyy'),
                    arrivingOn: formatDate(booking.starttime, 'hh:mm a'),
                    leavingOn: formatDate(booking.endtime, 'hh:mm a'),
                    plateNo: booking.plate,
                    address: (booking.locationid as any).address
                })
            })

            if (error) return { code: 1, message: 'Failed to send email', error }
            return { code: 0, message: 'Email sent' }
        }
        return { code: 1, message: 'Booking not found' }
    } catch (error) {
        console.error(error)
        throw error
    }
}

/**
 * Get Bookings - FIXED for Timezones
 * Uses a range query (start of day to end of day)
 */
export async function getBookings(date: Date, locationid: string, status: BookingStatus) {
    try {
        await connectToDB()

        // Normalize the date to avoid timezone string mismatches
        const queryDate = new Date(date)
        const start = startOfDay(queryDate)
        const end = endOfDay(queryDate)

        const bookings = await BookingModel.find({
            status: status || BookingStatus.BOOKED,
            locationid: locationid,
            bookingdate: {
                $gte: start,
                $lte: end
            }
        }).populate({
            path: 'locationid', model: ParkingLocationModel
        }).sort({ starttime: 1 }).lean()

        return {
            code: 0,
            message: 'Success',
            data: JSON.parse(JSON.stringify(bookings))
        }
    } catch (error) {
        console.error(error)
        return { code: 1, message: 'Failed to fetch bookings', data: [] }
    }
}

export async function cancelBooking({ bookingid, path }: { bookingid: string, path: string }) {
    try {
        await connectToDB()
        const booking = await BookingModel.findByIdAndUpdate(bookingid, {
            status: BookingStatus.CANCELLED,
            amount: 0
        })

        if (!booking) return { code: 1, message: 'Booking not found' }

        revalidatePath(path)
        return { code: 0, message: 'Booking cancelled' }
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function deleteBooking(bookingid: string) {
    try {
        await connectToDB()
        await BookingModel.findByIdAndDelete(bookingid)
    } catch (error) {
        console.error(error)
        throw error
    }
}