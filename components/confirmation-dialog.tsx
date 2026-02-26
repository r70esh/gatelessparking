'use client'

import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertCircle } from 'lucide-react' // Added for a modern visual cue

function ConfirmationDialog({
    message,
    open, onClose, onConfirm
}: {
    message: string,
    open: boolean,
    onClose: () => void,
    onConfirm: () => void
}) {
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent className="max-w-md rounded-2xl border-none shadow-2xl p-8 bg-white">
                <AlertDialogHeader className="flex flex-col items-center text-center space-y-4">
                    {/* Visual Icon Header */}
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                        <AlertCircle size={32} strokeWidth={1.5} />
                    </div>
                    
                    <AlertDialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    
                    <AlertDialogDescription className="text-slate-500 text-base leading-relaxed">
                        {message}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-8 sm:justify-center gap-3">
                    <AlertDialogCancel 
                        onClick={onClose}
                        className="flex-1 rounded-xl py-6 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all font-semibold"
                    >
                        Cancel
                    </AlertDialogCancel>
                    
                    <AlertDialogAction 
                        onClick={onConfirm}
                        className="flex-1 rounded-xl py-6 bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all font-semibold active:scale-95"
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmationDialog