'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {
  children: React.ReactNode
  href: string
}

function ActiveLink({ children, href }: Props) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href} className="relative group">
      <span
        className={cn(
          // Layout
          "relative px-5 py-2.5 rounded-xl text-sm font-medium",
          "transition-all duration-300 ease-out",
          "flex items-center gap-2",

          // Default (dark navbar friendly)
          "text-slate-300",

          // Hover
          "hover:text-white",

          // Active
          isActive && "text-white"
        )}
      >
        {children}

        {/* Animated underline indicator */}
        <span
          className={cn(
            "absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] rounded-full",
            "bg-gradient-to-r from-purple-500 to-indigo-500",
            "transition-all duration-300 ease-out",
            isActive
              ? "w-6 opacity-100"
              : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-60"
          )}
        />
      </span>
    </Link>
  )
}

export default ActiveLink