'use client'

import { Subscriber } from '@/lib/types'

export default function ExportButton({ subscribers }: { subscribers: Subscriber[] }) {
  function handleExport() {
    const csv = ['Email,Tanggal Daftar,Confirmed']
    subscribers.forEach(s => {
      csv.push(`${s.email},${new Date(s.created_at).toLocaleDateString('id-ID')},${s.confirmed}`)
    })
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <button onClick={handleExport} style={{
      padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
      color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-space-mono)', fontSize: '10px',
      letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
    }}>
      Export CSV
    </button>
  )
}
