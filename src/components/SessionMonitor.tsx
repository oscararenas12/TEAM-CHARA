'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SessionMonitor() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }

      // Supabase automatically refreshes tokens
      // You can add a toast notification here for better UX
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  return null // This component doesn't render anything
}
