'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Article } from '@/lib/types'
import { slugify } from '@/lib/utils'

const BADGES = ['Artificial Intelligence', 'Trading', 'Psychology', 'Personal Finance']

export default function ArticleEditor({ article }: { article?: Article }) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    badge: article?.badge || '',
    description: article?.description || '',
    read_time: article?.read_time || '',
    urgensi: article?.urgensi || 3,
    content: article?.content || '',
    is_published: article?.is_published || false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  function handleTitleChange(title: string) {
    setForm(f => ({
      ...f,
      title,
      slug: f.slug || slugify(title),
    }))
  }

  async function handleSave(publish: boolean) {
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      ...(article ? { id: article.id } : {}),
      is_published: publish,
    }

    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || '',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Gagal menyimpan.')
      setSaving(false)
      return
    }

    router.push('/dashboard/articles')
    router.refresh()
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff', fontFamily: 'var(--font-space-mono)', fontSize: '13px',
    outline: 'none',
  }

  const labelStyle = {
    fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '2px',
    textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)',
    display: 'block', marginBottom: '8px',
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px' }}>
            {article ? 'Edit Artikel' : 'Artikel Baru'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '40px' }}>
            {article ? article.title : 'Tulis Artikel'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => handleSave(false)} disabled={saving} style={{ ...inputStyle, width: 'auto', cursor: 'pointer', padding: '10px 20px' }}>
            Simpan Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} style={{ ...inputStyle, width: 'auto', cursor: 'pointer', padding: '10px 20px', background: 'var(--red)', border: 'none', fontWeight: 700 }}>
            {saving ? 'Menyimpan...' : form.is_published ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '24px', padding: '12px 16px', background: 'rgba(220,30,30,0.1)', border: '1px solid rgba(220,30,30,0.3)', color: 'rgba(220,100,100,0.9)', fontFamily: 'var(--font-space-mono)', fontSize: '12px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Judul</label>
            <input
              value={form.title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Judul artikel..."
              style={{ ...inputStyle, fontSize: '18px', fontFamily: 'var(--font-inter)', padding: '14px' }}
            />
          </div>

          {/* Tab: Write / Preview */}
          <div>
            <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '0' }}>
              {(['write', 'preview'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{
                  padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '2px',
                  textTransform: 'uppercase', color: activeTab === tab ? 'var(--red)' : 'rgba(255,255,255,0.3)',
                  borderBottom: `2px solid ${activeTab === tab ? 'var(--red)' : 'transparent'}`,
                }}>
                  {tab === 'write' ? 'Tulis' : 'Preview'}
                </button>
              ))}
            </div>

            {activeTab === 'write' ? (
              <textarea
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Tulis konten artikel di sini. Bisa HTML atau plain text."
                rows={24}
                style={{
                  ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-space-mono)',
                  fontSize: '13px', lineHeight: 1.7,
                }}
              />
            ) : (
              <div
                className="artikel-body"
                dangerouslySetInnerHTML={{ __html: form.content }}
                style={{
                  padding: '20px', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)', minHeight: '400px',
                }}
              />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Slug (URL)</label>
              <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="artikel-slug" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Badge / Kategori</label>
              <select value={form.badge} onChange={e => setForm(f => ({ ...f, badge: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Pilih badge...</option>
                {BADGES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Deskripsi Singkat</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Deskripsi 1-2 kalimat..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div>
              <label style={labelStyle}>Read Time</label>
              <input value={form.read_time} onChange={e => setForm(f => ({ ...f, read_time: e.target.value }))} placeholder="8 menit baca" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Urgensi (1-5)</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setForm(f => ({ ...f, urgensi: n }))} style={{
                    width: '36px', height: '36px', background: n <= form.urgensi ? 'var(--red)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${n <= form.urgensi ? 'var(--red)' : 'rgba(255,255,255,0.1)'}`,
                    color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-bebas)', fontSize: '18px',
                  }}>{n}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
