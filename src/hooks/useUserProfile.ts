'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  university: string | null
  bio: string | null
  avatar_url: string | null
  phone: string | null
  is_verified: boolean
  rating: number
  items_sold: number
  items_listed: number
  created_at: string
  updated_at: string
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    async function loadUserProfile() {
      try {
        // Get current auth user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

        if (authError) throw authError
        if (!authUser) {
          if (isMounted) setLoading(false)
          return
        }

        if (isMounted) setUser(authUser)

        // Fetch profile from public.profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profileError) throw profileError

        if (isMounted) setProfile(profileData)
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadUserProfile()

    return () => {
      isMounted = false
    }
  }, [])

  return { profile, user, loading, error }
}
