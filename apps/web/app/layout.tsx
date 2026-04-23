import './globals.css'
import type { Metadata } from 'next'
import { HabitsProvider } from '@/components/habits-context'
import { ThemeProvider } from '@/components/theme-context'

export const metadata: Metadata = {
  title: 'Daily Tracker',
  description: 'Track habits, routines, wellness, and daily wins.',
  manifest: '/manifest.json'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <HabitsProvider>
            {children}
          </HabitsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
