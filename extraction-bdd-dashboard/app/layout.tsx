import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from './components/ui/toaster'
import React from 'react'

export const metadata: Metadata = {
  title: 'Conservative HITL Pipeline Demo',
  description: 'Real-time evidence validation with human oversight',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}