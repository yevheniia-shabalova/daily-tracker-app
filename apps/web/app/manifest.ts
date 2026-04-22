import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daily Tracker',
    short_name: 'Tracker',
    description: 'Track your routines, habits, and daily progress.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f6f2',
    theme_color: '#0f766e',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  }
}
