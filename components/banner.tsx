'use client'

import Link from 'next/link'
import { Calendar, LayoutDashboard } from 'lucide-react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

export default function Banners() {
  return (
    <header className="relative w-full">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-[#0f172a]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-900/40 transition-transform group-hover:scale-105">
              G
            </div>
            <h1 className="text-lg md:text-xl font-semibold tracking-tight text-white">
              Autospace
              <span className="text-purple-400 font-light ml-1">Parking</span>
            </h1>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-10">

            <NavLink href="/mybookings" icon={<Calendar size={16} />}>
              My bookings
            </NavLink>

            <NavLink href="/dashboard" icon={<LayoutDashboard size={16} />}>
              Admin
            </NavLink>

            <div className="h-6 w-px bg-white/10" />

            <SignedOut>
              <SignInButton mode="modal">
                <button className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-semibold",
                  "bg-gradient-to-r from-purple-600 to-indigo-600",
                  "hover:from-purple-500 hover:to-indigo-500",
                  "transition-all duration-200",
                  "shadow-lg shadow-purple-900/30",
                  "active:scale-95"
                )}>
                  Sign in
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

          </div>
        </div>
      </nav>

      {/* HERO BACKGROUND */}
      <div className="relative w-full h-[420px] bg-gradient-to-b from-[#0f172a] via-[#111827] to-slate-950 flex items-center justify-center text-center pt-20">
        
        {/* Subtle glow */}
        <div className="absolute w-[600px] h-[600px] bg-purple-600/20 blur-3xl rounded-full top-[-200px] -z-10" />
        
        <div className="max-w-3xl px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Find the perfect parking spot
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            Search, book, and park effortlessly with Autospace.
          </p>
        </div>
      </div>

    </header>
  )
}

/* Reusable NavLink */
function NavLink({
  href,
  icon,
  children
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 text-sm font-medium",
        "text-slate-300 hover:text-white",
        "transition-colors duration-200"
      )}
    >
      {icon}
      {children}
    </Link>
  )
}