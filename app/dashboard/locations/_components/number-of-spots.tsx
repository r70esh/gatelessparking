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
import { ArrowLeft, ArrowRight, Hash } from 'lucide-react'

const FormSchema = z.object({
    numberofspots: z
        .coerce
        .number({ invalid_type_error: "Must be a number" })
        .positive({ message: 'Value must be positive' })
        .finite({ message: "Must be a valid number" })
})

type NumberOfSpotsInput = z.infer<typeof FormSchema>

function NumberOfSpots({
    onNext, onPrev
}: ListSpotPropsType) {

    const mySpotStore = useMySpotStore()

    const form = useForm<NumberOfSpotsInput>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            numberofspots: mySpotStore.data.numberofspots
        }
    })

    const onSubmit = (data: NumberOfSpotsInput) => {
        mySpotStore.updateState({
            numberofspots: data.numberofspots
        })
        onNext()
    }

    return (
        <div className="grid w-full gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Capacity
                </h2>
                <p className="text-sm text-slate-400">
                    How many total parking spots are available at this location?
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name='numberofspots'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-slate-300 flex items-center gap-2">
                                    <Hash size={14} className="text-purple-400" /> Total Spots
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        type="number"
                                        placeholder='e.g. 5' 
                                        className="bg-white/5 border-white/10 text-white h-14 text-xl focus:ring-purple-500 focus:border-purple-500 rounded-xl"
                                    />
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
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default NumberOfSpots