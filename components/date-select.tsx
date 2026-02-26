'use client'

import React from 'react'
import { sub, format } from 'date-fns'
import { ControllerRenderProps } from 'react-hook-form'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { FormControl } from './ui/form'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar' // make sure path is correct

type DateSelectProps = {
  field: ControllerRenderProps<any>
  disableDates?: boolean
}

export default function DateSelect({ field, disableDates = false }: DateSelectProps) {
  const disabled = disableDates
    ? (date: Date) => date < sub(new Date(), { days: 1 })
    : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={cn(
              'pl-3 pr-3 py-2 text-left font-normal w-full flex items-center justify-between rounded-lg border border-gray-300',
              !field.value && 'text-gray-400'
            )}
          >
            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-2 rounded-lg shadow-lg" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}