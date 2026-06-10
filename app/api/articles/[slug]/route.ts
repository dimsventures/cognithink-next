import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

interface Params { params: Promise<{ slug: string }> }

// GET /api/articles/[slug]
export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 })
  return NextResponse.json({ article: data })
}

// DELETE /api/articles/[slug]
export async function DELETE(req: NextRequest, { params }: Params) {
  const adminKey = req.headers.get('x-admin-key')
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params
  const supabase = createServiceClient()
  const { error } = await supabase.from('articles').delete().eq('slug', slug)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
