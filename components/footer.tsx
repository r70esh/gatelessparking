'use client'

import React from 'react'
import Link from 'next/link'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Mail, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-400 border-t border-white/5">

      {/* Subtle glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-16">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">

          {/* Brand */}
          <div className="flex flex-col gap-6">
            <h2 className="text-white text-2xl font-semibold tracking-tight">
              Autospace
              <span className="text-indigo-500 font-light ml-1">
                
              </span>
            </h2>

            <p className="text-sm leading-relaxed max-w-xs text-slate-500">
              Making urban mobility seamless, one parking spot at a time.
            </p>
          </div>

          {/* Contact */}
          <FooterColumn
            title="Company"
            links={[
              { label: 'About us', href: '/about' },
              { label: 'Support', href: '/support' },
              { label: 'Contact', href: '/contact' }
            ]}
          />

          {/* Resources */}
          <FooterColumn
            title="Resources"
            links={[
              { label: 'Sitemap', href: '/sitemap' },
              { label: 'Privacy policy', href: '/privacy' },
              { label: 'Terms of service', href: '/terms' }
            ]}
          />

          {/* Newsletter */}
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
              Stay updated
            </p>

            <div className="space-y-4">

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />

                <Input
                  placeholder="Email address"
                  className={cn(
                    "h-14 pl-12 pr-4 rounded-2xl",
                    "bg-slate-900/60 backdrop-blur",
                    "border border-white/10",
                    "text-white placeholder:text-slate-500",
                    "focus-visible:ring-2 focus-visible:ring-indigo-500/20",
                    "focus-visible:border-indigo-500",
                    "transition-all"
                  )}
                />
              </div>

              <Button
                className={cn(
                  "h-14 rounded-2xl",
                  "bg-gradient-to-r from-indigo-600 to-purple-600",
                  "hover:from-indigo-500 hover:to-purple-500",
                  "text-white font-semibold",
                  "shadow-lg shadow-indigo-900/30",
                  "transition-all duration-200",
                  "active:scale-95 group"
                )}
              >
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          <p>© 2026 Autospace. All rights reserved.</p>

          <div className="flex gap-8">
            <SocialLink label="Twitter" />
            <SocialLink label="LinkedIn" />
            <SocialLink label="Instagram" />
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer


/* Reusable Footer Column */
function FooterColumn({
  title,
  links
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
        {title}
      </p>

      <nav className="flex flex-col gap-4 text-sm">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}


/* Social link */
function SocialLink({ label }: { label: string }) {
  return (
    <span className="cursor-pointer hover:text-white transition-colors">
      {label}
    </span>
  )
}