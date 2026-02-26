'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import ActiveLink from './active-link'
import { UserButton } from '@clerk/nextjs'
import { 
  LayoutDashboard, 
  MapPin, 
  CalendarCheck, 
  BarChart3, 
  Settings 
} from 'lucide-react' // Modern icons

function Sidebar() {
  return (
    <aside className="flex flex-col z-10 w-72 bg-slate-950 text-slate-400 h-full border-r border-slate-900 transition-all duration-300">
        
        {/* Brand / Logo Section */}
        <div className="p-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                    <LayoutDashboard size={20} />
                </div>
                <h1 className='text-xl font-bold text-white tracking-tight'>
                    Dashboard
                </h1>
            </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col justify-between h-full px-4 pb-8">
          <nav>
            <ul className='w-full space-y-2 flex flex-col'>
              <li className="group">
                <ActiveLink href='/dashboard/locations/tileview'>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} />
                    <span>Locations</span>
                  </div>
                </ActiveLink>
              </li>
              <li className="group">
                <ActiveLink href='/dashboard/bookings'>
                  <div className="flex items-center gap-3">
                    <CalendarCheck size={18} />
                    <span>Bookings</span>
                  </div>
                </ActiveLink>
              </li>
              <li className="group">
                <ActiveLink href='/dashboard/revenue'>
                  <div className="flex items-center gap-3">
                    <BarChart3 size={18} />
                    <span>Revenue</span>
                  </div>
                </ActiveLink>
              </li>
            </ul>
            
            {/* Optional Divider and Secondary Nav */}
            <div className="my-6 mx-4 border-t border-slate-900" />
            <ul className='w-full space-y-2 flex flex-col'>
                <li className="group">
                    <ActiveLink href='/dashboard/settings'>
                    <div className="flex items-center gap-3">
                        <Settings size={18} />
                        <span>Settings</span>
                    </div>
                    </ActiveLink>
                </li>
            </ul>
          </nav>

          {/* User Profile Section - Now more prominent */}
          <div className="mt-auto pt-6 border-t border-slate-900 px-2">
            <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-2xl hover:bg-slate-900 transition-colors">
                <div className="flex items-center gap-3">
                    <UserButton afterSignOutUrl="/" />
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">Admin Account</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Premium Access</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
    </aside>
  )
}

export default Sidebar