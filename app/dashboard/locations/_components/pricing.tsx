import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMySpotStore } from '@/store'
import { ListSpotPropsType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Allow 0 as a valid price
const FormSchema = z.object({
    hourly: z
        .coerce
        .number({ invalid_type_error: "Must be a number" })
        .nonnegative({ message: 'Price must be 0 or greater' }) // <-- changed from .positive()
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
            hourly: mySpotStore.data.price?.hourly ?? 0 // default to 0 if undefined
        }
    })

    const onSubmit = (data: PricingInput) => {
        mySpotStore.updateState({
            price: { ...data }
        })

        onNext()
    }

    return (
        <div className="grid w-full gap-1.5">
            <h2 className="text-xl sm:text-2xl py-4 font-semibold">Pricing</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name='hourly'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        placeholder='e.g. 0 for free, 10 for paid' 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between py-4">
                        <Button type='button' variant='ghost' onClick={onPrev}>Prev</Button>
                        <Button type='submit' variant='ghost'>Next</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default Pricing
