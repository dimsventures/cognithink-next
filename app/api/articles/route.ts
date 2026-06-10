import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

// GET /api/articles — list published articles
export async function GET() {
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, badge, description, read_time, urgensi, published_at, view_count')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ articles: data })
}

// POST /api/articles — create/update article (admin)
export async function POST(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key')
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const supabase = createServiceClient()

  if (body.id) {
    // Update
    const { data, error } = await supabase
      .from('articles')
      .update({
        title: body.title,
        content: body.content,
        badge: body.badge,
        description: body.description,
        read_time: body.read_time,
        urgensi: body.urgensi,
        is_published: body.is_published,
        published_at: body.is_published && !body.published_at ? new Date().toISOString() : body.published_at,
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ article: data })
  }

  // Create
  const { data, error } = await supabase
    .from('articles')
    .insert({
      slug: body.slug,
      title: body.title,
      content: body.content,
      badge: body.badge,
      description: body.description,
      read_time: body.read_time,
      urgensi: body.urgensi || 3,
      is_published: body.is_published || false,
      published_at: body.is_published ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ article: data }, { status: 201 })
}
