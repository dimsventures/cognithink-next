import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px', flexShrink: 0, background: 'var(--dark)',
        borderRight: '1px solid rgba(255,255,255,0.06)', padding: '32px 0',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '0 24px', marginBottom: '40px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-bebas)', fontSize: '22px', letterSpacing: '2px', textDecoration: 'none', color: '#fff' }}>
            COGNI<span style={{ color: 'var(--red)' }}>THINK</span>
          </Link>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: '4px' }}>Admin</div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {[
            { href: '/dashboard', label: 'Overview', icon: '◈' },
            { href: '/dashboard/articles', label: 'Artikel', icon: '◎' },
            { href: '/dashboard/subscribers', label: 'Subscribers', icon: '◉' },
            { href: '/dashboard/analytics', label: 'Analytics', icon: '◇' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 24px', textDecoration: 'none',
              fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '1px',
              color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s',
            }}>
              <span style={{ color: 'var(--red)' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '0 24px', marginTop: 'auto' }}>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '40px' }}>
        {children}
      </main>
    </div>
  )
}

