'use client'

import React, { useEffect } from 'react'
import { Form, FormControl, FormField, FormItem } from './ui/form'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SearchIcon, MapPin, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

// Components
import DateSelect from './date-select'
import TimeSelect from './time-select'
import AddressAutoCompleteInput from './address-autocomplete.input'
import { LatLng } from '@/types'

const FormSchema = z.object({
    address: z.string().min(1, "Required"),
    arrivingon: z.date({ required_error: "Required" }),
    gpscoords: z.object({ lat: z.number(), lng: z.number() }),
    arrivingtime: z.string().min(1, "Required"),
    leavingtime: z.string().min(1, "Required")
})

export default function SearchForm({ onSearch }: { onSearch: (data: any) => void }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            address: '',
            arrivingtime: '',
            leavingtime: '',
            gpscoords: { lat: 27.7172, lng: 85.3240 }
        }
    })

    const arrivingTime = useWatch({ control: form.control, name: 'arrivingtime' })

    useEffect(() => {
        if (arrivingTime) form.resetField('leavingtime')
    }, [arrivingTime, form])

    function onSubmit(formData: z.infer<typeof FormSchema>) {
        onSearch({ ...formData, arrivingon: format(formData.arrivingon, 'yyyy-MM-dd') })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} 
                className="flex flex-col lg:flex-row items-center w-full bg-black/60 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-2 shadow-2xl"
            >
                {/* 1. Address Section */}
                <div className="flex-[1.5] w-full px-6 py-4 hover:bg-white/5 rounded-3xl transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-purple-400" />
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                    </div>
                    <AddressAutoCompleteInput 
                        onAddressSelect={(addr, gps) => { form.setValue('address', addr); form.setValue('gpscoords', gps); }} 
                        selectedAddress={form.watch('address')} 
                    />
                </div>

                <div className="hidden lg:block w-px h-12 bg-white/10" />

                {/* 2. Date Section */}
                <FormField control={form.control} name='arrivingon' render={({ field }) => (
                    <FormItem className="flex-1 w-full px-6 py-4 hover:bg-white/5 rounded-3xl transition-all">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar size={14} className="text-purple-400" />
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                        </div>
                        <FormControl>
                            <DateSelect field={field} disableDates={true} />
                        </FormControl>
                    </FormItem>
                )} />

                <div className="hidden lg:block w-px h-12 bg-white/10" />

                {/* 3. Time Slots */}
                <div className="flex-[1.8] w-full flex">
                    <FormField control={form.control} name='arrivingtime' render={({ field }) => (
                        <FormItem className="flex-1 px-6 py-4 hover:bg-white/5 rounded-3xl transition-all">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock size={14} className="text-purple-400" />
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arrive</label>
                            </div>
                            <FormControl>
                                <TimeSelect onChange={field.onChange} defaultValue={field.value} />
                            </FormControl>
                        </FormItem>
                    )} />
                    
                    <FormField control={form.control} name='leavingtime' render={({ field }) => (
                        <FormItem className="flex-1 px-6 py-4 hover:bg-white/5 rounded-3xl transition-all">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Exit</label>
                            <FormControl>
                                <TimeSelect 
                                    disableTime={form.watch('arrivingtime')}
                                    onChange={field.onChange} 
                                    defaultValue={field.value} 
                                />
                            </FormControl>
                        </FormItem>
                    )} />
                </div>

                {/* 4. Action Button */}
                <div className="p-1 w-full lg:w-auto">
                    <button type="submit" 
                        className="w-full lg:w-16 h-16 bg-purple-600 hover:bg-purple-500 text-white rounded-[1.8rem] flex items-center justify-center transition-all shadow-lg active:scale-95 group"
                    >
                        <SearchIcon size={24} className="group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            </form>
        </Form>
    )
}