import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
    // Sign them out so they can see the success message on login page
    await supabase.auth.signOut()
  }

  // Redirect to login with success message after email verification
  return NextResponse.redirect(`${origin}/login?verified=true`)
}
