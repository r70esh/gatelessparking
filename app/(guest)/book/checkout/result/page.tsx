import { stripe } from "@/lib/stripe"
import Stripe from "stripe"
import { Metadata } from '@stripe/stripe-js'
import { connectToDB } from "@/lib/db"
import { Booking, BookingModel } from "@/schemas/booking"
import { ParkingLocation, ParkingLocationModel } from "@/schemas/parking-locations"
import { format } from "date-fns"
import { BookingStatus } from "@/types"
import React from "react"
import { CheckCircle2 } from "lucide-react"
import { sendConfirmationEmail } from "@/actions/actions"
import { currentUser } from "@clerk/nextjs/server"

async function BookingCheckoutResultPage({
    searchParams
}: { searchParams: { session_id: string } }) {

    const session_id = searchParams.session_id
    const user = await currentUser()

    if (!session_id) throw new Error("Invalid session id")
    if (!user) throw new Error("You must be logged in")

    const checkoutSession = await stripe.checkout.sessions.retrieve(
        session_id,
        { expand: ['payment_intent'] }
    )

    /**
     * ✅ SAFE STRIPE STATUS CHECK
     * - paid
     * - unpaid
     * - no_payment_required (FREE bookings)
     */
    const isSuccess =
        checkoutSession.payment_status === 'paid' ||
        checkoutSession.payment_status === 'no_payment_required'

    let address = ''
    let date = ''
    let arrivingon = ''
    let leavingon = ''
    let plate = ''

    if (isSuccess) {
        const metadata = checkoutSession.metadata as Metadata
        const bookingid = metadata?.bookingid

        if (!bookingid) {
            throw new Error("Missing booking id in Stripe metadata")
        }

        await connectToDB()

        const booking = await BookingModel
            .findById<Booking>(bookingid)
            .populate({ path: 'locationid', model: ParkingLocationModel })

        if (booking) {
            const location = booking.locationid as ParkingLocation

            address = location.address
            date = format(booking.bookingdate!, 'MMM dd, yyyy')
            arrivingon = format(booking.starttime!, 'hh:mm a')
            leavingon = format(booking.endtime!, 'hh:mm a')
            plate = booking.plate

            if (booking.status === BookingStatus.PENDING) {
                booking.status = BookingStatus.BOOKED
                booking.stripesessionid = session_id

                await booking.save()
                await sendConfirmationEmail(bookingid)
            }
        }
    }

    return (
        <>
            {isSuccess ? (
                <main className="sm:container flex flex-col items-center pt-16">
                    <CheckCircle2 size={64} className="text-green-500" />
                    <p className="font-medium text-primary text-2xl sm:text-4xl py-8">
                        Thank you!
                    </p>

                    <h1 className="mt-2 text-3xl text-center font-bold tracking-tight sm:text-5xl">
                        Your booking has been confirmed.
                    </h1>

                    <p className="mt-2 sm:text-base text-zinc-700 py-4 text-xl">
                        Here is your booking details:
                    </p>

                    <div className="flex flex-col p-1 sm:p-0">
                        <Detail label="Parking at:" value={address} />
                        <Detail label="Arriving on:" value={`${date} ${arrivingon}`} />
                        <Detail label="Leaving on:" value={`${date} ${leavingon}`} />
                        <Detail label="Plate no:" value={plate.toUpperCase()} />
                    </div>

                    <p className="mt-2 sm:text-base text-zinc-500 py-16 text-xl">
                        We have also sent you an email with the details.
                    </p>
                </main>
            ) : (
                <p className="text-red-500 text-center pt-16">
                    Payment failed or was cancelled.
                </p>
            )}
        </>
    )
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-2 place-items-center sm:place-items-start">
            <p className="text-zinc-700">{label}</p>
            <p className="text-zinc-700 place-self-start">{value}</p>
        </div>
    )
}

export default BookingCheckoutResultPage
