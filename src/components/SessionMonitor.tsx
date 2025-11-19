'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SessionMonitor() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Check initial session and clear if invalid
    supabase.auth.getSession().catch(async (error) => {
      console.error('Session error:', error)
      await supabase.auth.signOut()
      router.push('/login')
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }

      // Handle token refresh errors
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.error('Token refresh failed')
        await supabase.auth.signOut()
        router.push('/login')
      }

      // Handle user updated (covers account changes)
      if (event === 'USER_UPDATED' && !session) {
        await supabase.auth.signOut()
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return null // This component doesn't render anything
}
