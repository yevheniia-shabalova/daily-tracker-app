import { NavTabs } from '@/components/nav-tabs'

export default function TabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavTabs />
      {children}
    </>
  )
}
