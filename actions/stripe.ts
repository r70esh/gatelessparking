'use server'

import { connectToDB } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { formatAmountForStripe } from '@/lib/utils'
import { BookingModel } from '@/schemas/booking'
import { BookingStatus } from '@/types' // Import your Enum
import { currentUser } from '@clerk/nextjs/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Stripe from 'stripe'

export async function createCheckoutSession(data: FormData): Promise<void> {
    const now = new Date()

    const user = await currentUser()
    if (!user) {
        throw new Error('You must be logged in')
    }

    await connectToDB()

    const bookingdate = data.get('bookingdate')?.toString()
    const starttime = data.get('starttime')?.toString()
    const endtime = data.get('endtime')?.toString()
    const amount = Number(data.get('amount') ?? 0)
    const plate = (data.get('plate')?.toString() ?? '').replaceAll(' ', '').toUpperCase()
    const locationid = data.get('locationid')?.toString()
    const address = data.get('address')?.toString() ?? 'Parking'

    if (!bookingdate || !starttime || !endtime || !locationid) {
        throw new Error('Missing required booking fields')
    }

    // 1. Create the booking with PENDING status
    const booking = await BookingModel.create({
        locationid,
        bookingdate: new Date(bookingdate), // Store the pure date
        starttime: new Date(`${bookingdate}T${starttime}`),
        endtime: new Date(`${bookingdate}T${endtime}`),
        amount,
        timeoffset: now.getTimezoneOffset(),
        plate,
        userid: user.id,
        status: BookingStatus.PENDING, 
    })

    // 2. Handle Free Bookings (Mark as BOOKED immediately)
    if (amount === 0) {
        booking.status = BookingStatus.BOOKED;
        await booking.save();
        redirect(`${headers().get('origin')}/book/checkout/result?session_id=free_${booking._id}`);
        return
    }

    // 3. Handle Paid Bookings via Stripe
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: user.primaryEmailAddress?.emailAddress,
        metadata: { 
            bookingid: booking._id.toString() // Crucial for the result page to find it
        },
        line_items: [
            {
                price_data: {
                    currency: 'npr',
                    product_data: { 
                        name: `Parking Booking`,
                        description: `At ${address} for plate ${plate}`
                    },
                    unit_amount: formatAmountForStripe(amount, 'NPR'),
                },
                quantity: 1,
            },
        ],
        success_url: `${headers().get('origin')}/book/checkout/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${headers().get('origin')}/locations`,
    })

    redirect(checkoutSession.url!)
}