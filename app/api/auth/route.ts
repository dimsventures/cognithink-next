import { NextRequest, NextResponse } from 'next/server'
import { checkAdminPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: 'Password salah' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('ct_admin_session', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('ct_admin_session')
  return response
}
