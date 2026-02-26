'use client'

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useMySpotStore } from '@/store'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import SpotAddress from './spot-address'
import NumberOfSpots from './number-of-spots'
import Pricing from './pricing'
import Summary from './summary'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const totalSteps = 4
const stepIncrement = 100/totalSteps

type Props = {
    id?: string | null,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function AddLocationDialog({id=null,open,setOpen}:Props) {
    const [step, setStep] = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const mySpotStore = useMySpotStore()
    const router = useRouter()

    useEffect(() => {
        if (open) {
            setStep(1)
            if (!id) mySpotStore.restart()
        }
    }, [id, open])

    const handleFinalSubmit = async () => {
        setSubmitting(true)
        const data = new FormData()
        data.set('data', JSON.stringify(mySpotStore.data))

        const result = await fetch('/api/parkinglocation/new', {
            method: 'POST',
            body: data
        })
        setSubmitting(false)

        if (result.ok) {
            toast.success("Record created successfully!")
            setOpen(false)
            router.refresh()
        } else {
            toast.error("Failed to create the parking location")
        }
    }

    const handleNextStepChange = () => {
        if (step === totalSteps ) return
        setStep(currentStep => currentStep + 1)
    }

    const handlePrevStepChange = () => {
        if (step === 1) return
        setStep(currentStep => currentStep - 1)
    }

    // Prevents Google Autocomplete from closing the dialog
    const handleOnInteracOutside = (e:Event) => {
        const target = e.target as HTMLElement;
        if (target?.closest('.pac-container')) {
            e.preventDefault()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent 
                onInteractOutside={handleOnInteracOutside}
                className="bg-[#0f172a]/95 backdrop-blur-2xl border-white/10 text-slate-200 sm:max-w-[500px] rounded-[2rem] shadow-2xl"
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-white text-center mb-4">
                        List your spot
                    </DialogTitle>
                    <div className="space-y-8">
                        {/* Custom Styled Progress Bar */}
                        <Progress 
                            value={step * stepIncrement} 
                            className="h-2 bg-white/10" 
                        />
                        
                        <div className="min-h-[300px] flex flex-col justify-center">
                            {{
                                1: <SpotAddress onNext={handleNextStepChange}/>,
                                2: <NumberOfSpots onNext={handleNextStepChange} onPrev={handlePrevStepChange} />,
                                3: <Pricing onNext={handleNextStepChange} onPrev={handlePrevStepChange} />,
                                4: <Summary onNext={handleNextStepChange} onPrev={handlePrevStepChange} />
                            }[step]}
                        </div>
                    </div>
                </DialogHeader>

                <DialogFooter className="mt-6">
                    <div className={`${step < totalSteps ? 'hidden' : 'flex flex-col w-full gap-3'}`}>
                        <Button 
                            disabled={submitting}
                            className="w-full h-12 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all"
                            onClick={handleFinalSubmit}
                        >
                            {submitting ? <Loader2 className="animate-spin mr-2" /> : 'Confirm & List Spot'}
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="text-slate-400 hover:text-white hover:bg-white/5"
                            onClick={() => {
                                mySpotStore.restart();
                                setStep(1);
                            }}
                        >
                            Reset Form
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddLocationDialog