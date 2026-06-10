import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email('Email tidak valid'),
})

// POST /api/subscribers — new subscriber signup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = subscribeSchema.parse(body)

    const supabase = createServiceClient()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('subscribers')
      .select('id, confirmed')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar.' },
        { status: 409 }
      )
    }

    const { error } = await supabase
      .from('subscribers')
      .insert({ email, confirmed: true })

    if (error) throw error

    return NextResponse.json({ success: true, message: 'Berhasil subscribe!' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 400 })
    }
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 })
  }
}

// GET /api/subscribers — admin only
export async function GET(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key')
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ subscribers: data, total: data?.length || 0 })
}
