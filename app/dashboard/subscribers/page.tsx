import { createServiceClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import ExportButton from './ExportButton'

export const dynamic = 'force-dynamic'

export default async function SubscribersPage() {
  const supabase = createServiceClient()
  const { data: subscribers, count } = await supabase
    .from('subscribers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px' }}>Audience</div>
          <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '40px' }}>Subscribers</h1>
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
            {count || 0} total subscribers
          </div>
        </div>
        {subscribers && subscribers.length > 0 && (
          <ExportButton subscribers={subscribers} />
        )}
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '16px', padding: '12px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['Email', 'Tanggal Daftar', 'Status'].map(h => (
            <span key={h} style={{ fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{h}</span>
          ))}
        </div>

        {(!subscribers || subscribers.length === 0) && (
          <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'var(--font-space-mono)', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            Belum ada subscribers.
          </div>
        )}

        {subscribers?.map(sub => (
          <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '16px', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center' }}>
            <span style={{ fontSize: '14px' }}>{sub.email}</span>
            <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
              {formatDate(sub.created_at)}
            </span>
            <span style={{
              fontFamily: 'var(--font-space-mono)', fontSize: '9px', letterSpacing: '1px',
              textTransform: 'uppercase', padding: '4px 10px',
              background: sub.confirmed ? 'rgba(0,200,100,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${sub.confirmed ? 'rgba(0,200,100,0.3)' : 'rgba(255,255,255,0.1)'}`,
              color: sub.confirmed ? 'rgba(0,200,100,0.8)' : 'rgba(255,255,255,0.3)',
            }}>
              {sub.confirmed ? 'Confirmed' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
