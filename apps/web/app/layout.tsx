import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Daily Tracker',
  description: 'Track habits, routines, wellness, and daily wins.',
  manifest: '/manifest.json'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
