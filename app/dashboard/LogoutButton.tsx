'use client'

export default function LogoutButton() {
  return (
    <a
      href="#"
      onClick={async e => {
        e.preventDefault()
        await fetch('/api/auth', { method: 'DELETE' })
        window.location.href = '/login'
      }}
      style={{
        fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '1px',
        color: 'rgba(255,255,255,0.3)', textDecoration: 'none', textTransform: 'uppercase',
      }}
    >
      ← Logout
    </a>
  )
}
