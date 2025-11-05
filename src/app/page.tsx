'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if coming from email verification with a code
    const code = searchParams.get('code')

    if (code) {
      // Redirect to callback to process verification
      router.push(`/api/auth/callback?code=${code}`)
    } else {
      // Normal access, redirect to login
      router.push('/login')
    }
  }, [router, searchParams])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Loading...</p>
    </div>
  )
}
