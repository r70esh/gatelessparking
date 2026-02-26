'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMySpotStore } from '@/store'
import { ListSpotPropsType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, Banknote } from 'lucide-react'

const FormSchema = z.object({
    hourly: z
        .coerce
        .number({ invalid_type_error: "Must be a number" })
        .nonnegative({ message: 'Price must be 0 or greater' })
        .finite({ message: "Must be a valid number" })
})

type PricingInput = z.infer<typeof FormSchema>

function Pricing({
    onNext, onPrev
}: ListSpotPropsType) {

    const mySpotStore = useMySpotStore()

    const form = useForm<PricingInput>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            hourly: mySpotStore.data.price?.hourly ?? 0
        }
    })

    const onSubmit = (data: PricingInput) => {
        mySpotStore.updateState({
            price: { ...data }
        })
        onNext()
    }

    return (
        <div className="grid w-full gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Set your rate
                </h2>
                <p className="text-sm text-slate-400">
                    How much would you like to charge per hour? Set to 0 for free parking.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name='hourly'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300 flex items-center gap-2">
                                    <Banknote size={14} className="text-purple-400" /> Hourly Rate (NPR)
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                                            Rs.
                                        </span>
                                        <Input 
                                            {...field} 
                                            type="number"
                                            className="bg-white/5 border-white/10 text-white h-14 pl-12 text-xl focus:ring-purple-500 focus:border-purple-500 rounded-xl"
                                            placeholder='0' 
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between items-center pt-4">
                        <Button 
                            type='button' 
                            variant='ghost' 
                            onClick={onPrev}
                            className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        
                        <Button 
                            type='submit' 
                            className="bg-purple-600 hover:bg-purple-500 text-white px-8 h-12 rounded-xl font-bold shadow-lg shadow-purple-900/20"
                        >
                            Review Summary <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default Pricing