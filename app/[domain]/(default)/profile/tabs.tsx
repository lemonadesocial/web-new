'use client'
import { useRouter, usePathname } from 'next/navigation'

const tabData = [
  { label: 'Events', path: 'events', icon: 'icon-ticket' },
  { label: 'Feed', path: 'feed', icon: 'icon-newspaper' },
  { label: 'Communities', path: 'communities', icon: 'icon-community' },
]

export function Tabs() {
  const router = useRouter()
  const pathname = usePathname()
  const base = pathname.split('/profile')[0] + '/profile';
  const active = tabData.findIndex(tab => pathname.startsWith(`${base}/${tab.path}`));

  return (
    <div className="grid grid-cols-3 gap-3">
      {tabData.map((tab, i) => (
        <div
          key={tab.label}
          className={`p-4 rounded-lg border flex justify-center cursor-pointer select-none ${active === i ? 'border-primary text-primary' : 'border-tertiary text-tertiary'}`}
          onClick={() => router.push(`${base}/${tab.path}`)}
          aria-selected={active === i}
          role="tab"
          tabIndex={active === i ? 0 : -1}
        >
          <i className={`${tab.icon} size-8`} />
        </div>
      ))}
    </div>
  )
}
