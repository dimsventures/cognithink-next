'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/dashboard'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push(from)
    } else {
      setError('Password salah.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--black)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '40px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '32px', letterSpacing: '2px', marginBottom: '8px' }}>
          COGNI<span style={{ color: 'var(--red)' }}>THINK</span>
        </div>
        <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '48px' }}>
          Admin Dashboard
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoFocus
            style={{
              padding: '14px 18px', background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${error ? 'rgba(220,30,30,0.6)' : 'rgba(255,255,255,0.15)'}`,
              color: '#fff', fontFamily: 'var(--font-space-mono)', fontSize: '14px', outline: 'none',
            }}
          />
          {error && (
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'rgba(220,30,30,0.8)' }}>{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'rgba(220,30,30,0.5)' : 'var(--red)',
              color: '#fff', border: 'none', padding: '14px',
              fontFamily: 'var(--font-space-mono)', fontSize: '12px', letterSpacing: '2px',
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
