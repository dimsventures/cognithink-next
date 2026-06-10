'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100,
      padding: '18px 40px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(220,30,30,0.15)',
    }}>
      <Link href="/" style={{
        fontFamily: 'var(--font-bebas)', fontSize: '26px', letterSpacing: '2px',
        textDecoration: 'none', color: '#fff',
      }}>
        COGNI<span style={{ color: 'var(--red)' }}>THINK</span>
      </Link>

      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '30px',
      }} className="nav-links-desktop">
        <NavLink href="/artikel">Artikel</NavLink>
        <NavLink href="/#resources">Resources</NavLink>
        <NavLink href="/#community">Community</NavLink>
      </div>

      <Link href="/artikel" style={{
        background: 'var(--red)', color: '#fff', border: 'none',
        padding: '10px 22px', fontFamily: 'var(--font-inter)', fontSize: '14px',
        fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase',
        cursor: 'pointer', textDecoration: 'none', transition: 'background 0.3s',
        whiteSpace: 'nowrap',
      }}
        onMouseOver={e => (e.currentTarget.style.background = 'var(--orange)')}
        onMouseOut={e => (e.currentTarget.style.background = 'var(--red)')}
      >
        Baca Artikel
      </Link>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{
      fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '2px',
      color: 'rgba(255,255,255,0.6)', textDecoration: 'none', textTransform: 'uppercase',
      transition: 'color 0.3s',
    }}
      onMouseOver={e => (e.currentTarget.style.color = 'var(--red)')}
      onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
    >
      {children}
    </Link>
  )
}
