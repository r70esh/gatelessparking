'use client'

import { getParkingLocation } from '@/actions/actions'
import { createCheckoutSession } from '@/actions/stripe'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { formatAmountForDisplay, getStreetFromAddress } from '@/lib/utils'
import { ParkingLocation } from '@/schemas/parking-locations'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInMinutes, format, parseISO } from 'date-fns'
import { ArrowRight, Loader2, CreditCard, Car } from 'lucide-react'
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const FormSchema = z.object({
    plateno: z.string().min(1, {
        message: 'Plate number is required.'
    }).transform(val => val.replace(/\s+/g, '').toUpperCase()) 
    // Automatically cleans spaces and capitalizes
})

export default function BookPage() {
    const [loading, setLoading] = useState(false)
    const params = useParams<{ locationId: string }>()
    const searchParams = useSearchParams()
    
    const locationId = params.locationId
    const date = searchParams.get('date')
    const startTime = searchParams.get('starttime')
    const endTime = searchParams.get('endtime')
    
    const [location, setLocation] = useState<ParkingLocation | null>(null)

    useEffect(() => {
        const fetchLocation = async () => {
            if (locationId) {
                const data = await getParkingLocation(locationId)
                setLocation(data as ParkingLocation)
            }
        }
        fetchLocation()
    }, [locationId])

    const diffInHours = useMemo(() => {
        if (!date || !startTime || !endTime) return 0;
        try {
            // Ensure format is ISO compliant for cross-browser stability
            const start = new Date(`${date}T${startTime}:00`);
            const end = new Date(`${date}T${endTime}:00`);
            const minutes = differenceInMinutes(end, start);
            return Math.max(minutes / 60, 0);
        } catch (e) {
            return 0;
        }
    }, [date, startTime, endTime]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { plateno: '' }
    })

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        setLoading(true)
        try {
            const totalAmount = diffInHours * (location?.price.hourly || 0)
            
            const fd = new FormData()
            fd.append('address', getStreetFromAddress(location?.address || ''))
            fd.append('amount', totalAmount.toFixed(2)) // Use fixed decimals for form data
            fd.append('locationid', `${location?._id}`)
            fd.append('bookingdate', date!)
            fd.append('starttime', startTime!)
            fd.append('endtime', endTime!)
            fd.append('plate', formData.plateno)

            await createCheckoutSession(fd)
        } catch (error) {
            console.error("Booking Error:", error)
            setLoading(false)
        }
    }

    if (!location || !date) return (
        <div className="h-screen flex items-center justify-center bg-[#0f172a]">
            <Loader2 className="animate-spin text-purple-500" size={48} />
        </div>
    );

    const totalPrice = diffInHours * location.price.hourly;

    return (
        <div className='min-h-screen bg-[#0f172a] text-slate-200 flex flex-col font-sans'>
            <main className="flex-grow container max-w-2xl py-12 px-4">
                
                {/* Header Section */}
                <div className="bg-white/5 backdrop-blur-md rounded-t-[2rem] p-8 border border-white/10 border-b-0">
                    <h1 className="text-2xl font-black text-white mb-2">Confirm Booking</h1>
                    <p className="text-purple-400 font-medium">{getStreetFromAddress(location.address)}</p>
                </div>

                {/* Status/Timeline Bar */}
                <div className="bg-purple-600/20 border-x border-white/10 grid grid-cols-3 p-6 items-center">
                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest text-purple-300 font-bold mb-1">Entrance</p>
                        <p className="text-sm font-bold text-white">{startTime}</p>
                        <p className="text-[10px] text-purple-200">{format(parseISO(date), 'MMM dd')}</p>
                    </div>
                    <div className="flex justify-center">
                        <ArrowRight className="text-purple-500" size={20} />
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] uppercase tracking-widest text-purple-300 font-bold mb-1">Exit</p>
                        <p className="text-sm font-bold text-white">{endTime}</p>
                        <p className="text-[10px] text-purple-200">{format(parseISO(date), 'MMM dd')}</p>
                    </div>
                </div>

                {/* Form Section */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white/5 backdrop-blur-md rounded-b-[2rem] p-8 space-y-8 border border-white/10 border-t-0'>
                        
                        {/* Price Breakdown */}
                        <div className="bg-black/20 rounded-2xl p-6 space-y-3 border border-white/5">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Rate per hour</span>
                                <span className="text-white font-bold">{formatAmountForDisplay(location.price.hourly, 'NPR')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Duration ({diffInHours.toFixed(1)} hrs)</span>
                                <span className="text-white font-bold">{formatAmountForDisplay(totalPrice, 'NPR')}</span>
                            </div>
                            <Separator className="bg-white/10" />
                            <div className="flex justify-between text-lg pt-2">
                                <span className="font-bold text-white">Grand Total</span>
                                <span className="font-black text-purple-400">{formatAmountForDisplay(totalPrice, 'NPR')}</span>
                            </div>
                        </div>

                        {/* Plate Input */}
                        <FormField
                            control={form.control}
                            name='plateno'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300 flex items-center gap-2 mb-2">
                                        <Car size={16} className="text-purple-500" /> Vehicle Plate Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            className='bg-black/40 border-white/10 text-white h-14 text-xl font-mono uppercase tracking-widest focus:ring-2 focus:ring-purple-500 transition-all' 
                                            placeholder='BA 1 PA 1234' 
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormDescription className="text-slate-500 text-[11px] leading-tight mt-2">
                                        Note: Your plate is used for automatic enforcement. Make sure it is correct.
                                    </FormDescription>
                                </FormItem>
                            )}
                        />  

                        <Button 
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-lg font-bold shadow-xl shadow-purple-900/40 transition-all transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" />
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CreditCard size={20} />
                                    <span>Secure Checkout</span>
                                </div>
                            )}
                        </Button>
                    </form>
                </Form>
            </main>
            <Footer />
        </div>
    )
}