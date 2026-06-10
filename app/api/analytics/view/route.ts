import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { hashIp } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { articleId } = await req.json()
    if (!articleId) return NextResponse.json({ error: 'Missing articleId' }, { status: 400 })

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown'
    const ipHash = hashIp(ip)

    const supabase = createServiceClient()

    // Log view
    await supabase.from('article_views').insert({
      article_id: articleId,
      ip_hash: ipHash,
    })

    // Increment view_count
    const { error: rpcError } = await supabase.rpc('increment_view_count', { article_id: articleId })
    if (rpcError) {
      // Fallback jika rpc belum ada
      const { data } = await supabase.from('articles').select('view_count').eq('id', articleId).single()
      if (data) {
        await supabase.from('articles').update({ view_count: (data.view_count || 0) + 1 }).eq('id', articleId)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Error tracking view' }, { status: 500 })
  }
}
