'use client'

import { useState } from 'react'

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage('Email terdaftar! Kamu akan dapat notifikasi artikel terbaru.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Gagal mendaftar. Coba lagi.')
      }
    } catch {
      setStatus('error')
      setMessage('Terjadi kesalahan. Coba lagi.')
    }
  }

  if (status === 'success') {
    return (
      <div style={{
        background: 'rgba(220,30,30,0.06)', border: '1px solid rgba(220,30,30,0.3)',
        padding: compact ? '16px 20px' : '20px 24px', color: 'rgba(255,255,255,0.8)',
        fontFamily: 'var(--font-space-mono)', fontSize: '12px', letterSpacing: '1px',
      }}>
        ✓ {message}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', maxWidth: compact ? '100%' : '480px' }}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="email@kamu.com"
        required
        style={{
          flex: 1, padding: compact ? '12px 16px' : '14px 18px',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff', fontFamily: 'var(--font-inter)', fontSize: '15px',
          outline: 'none',
        }}
        onFocus={e => (e.target.style.borderColor = 'var(--red)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          background: status === 'loading' ? 'rgba(220,30,30,0.5)' : 'var(--red)',
          color: '#fff', border: 'none',
          padding: compact ? '12px 20px' : '14px 28px',
          fontFamily: 'var(--font-inter)', fontSize: '14px', fontWeight: 700,
          letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer',
          whiteSpace: 'nowrap', transition: 'background 0.3s',
        }}
        onMouseOver={e => { if (status !== 'loading') (e.currentTarget.style.background = 'var(--orange)') }}
        onMouseOut={e => { if (status !== 'loading') (e.currentTarget.style.background = 'var(--red)') }}
      >
        {status === 'loading' ? '...' : 'Subscribe'}
      </button>
      {status === 'error' && (
        <span style={{ fontSize: '12px', color: 'rgba(255,100,100,0.8)', alignSelf: 'center' }}>{message}</span>
      )}
    </form>
  )
}
