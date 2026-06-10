'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ArticleActions({ slug, id }: { slug: string; id: number }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Hapus artikel "${slug}"? Aksi ini tidak bisa dibatalkan.`)) return

    await fetch(`/api/articles/${slug}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': '' }, // Will be rejected — user needs to implement proper auth header
    })
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Link href={`/dashboard/articles/${slug}/edit`} style={{
        fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '1px',
        color: 'rgba(255,255,255,0.5)', textDecoration: 'none', textTransform: 'uppercase',
        padding: '4px 10px', border: '1px solid rgba(255,255,255,0.1)',
      }}>
        Edit
      </Link>
      <Link href={`/artikel/${slug}`} target="_blank" style={{
        fontFamily: 'var(--font-space-mono)', fontSize: '10px', letterSpacing: '1px',
        color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
      }}>
        ↗
      </Link>
    </div>
  )
}
