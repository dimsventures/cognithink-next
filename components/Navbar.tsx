'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: '56px',
      background: 'rgba(17, 17, 17, 0.94)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        padding: '0 40px', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          fontFamily: 'var(--font-bebas)', fontSize: '20px',
          letterSpacing: '2px', color: '#EDEBE7',
        }}>
          COGNI<span style={{ color: 'var(--red)' }}>THINK</span>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {[
            { href: '/#artikel', label: 'Artikel' },
            { href: '/#resources', label: 'Resources' },
            { href: '/#community', label: 'Community' },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{
              fontSize: '13px', fontWeight: 450,
              color: 'rgba(237, 235, 231, 0.55)',
              letterSpacing: '0.01em',
            }}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
