'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Tab = { label: string; href: string; id: string }

const tabs: Tab[] = [
  { label: 'Dashboard', href: '/', id: 'dashboard' },
  { label: 'Habits', href: '/habits', id: 'habits' },
  { label: 'Calendar', href: '/calendar', id: 'calendar' }
]

export function NavTabs() {
  const pathname = usePathname()
  
  const activeId = tabs.find(tab => tab.href === pathname)?.id || 'dashboard'

  return (
    <nav className="nav-tabs">
      <div className="nav-container">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`nav-tab ${activeId === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
