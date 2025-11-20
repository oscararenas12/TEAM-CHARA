'use client'

import React, { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import hatImg from "@/assets/hat.png"
import "../login/styles.css"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="login-page">
        <img id="hat" src={hatImg.src} alt="Hat logo" />
        <div>
          <h1>Student Mart</h1>
          <p id="des">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordContent() {
  const router = useRouter()
  const supabase = createClient()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Check if we have access (user came from email link)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      // Check for session or recovery token in URL
      const hash = window.location.hash
      const search = window.location.search
      const hasAccessToken = /access_token=/.test(hash)
      const isRecovery = /type=recovery/.test(hash + search)

      if (!session && !(hasAccessToken && isRecovery)) {
        // No session and no valid recovery token, redirect to forgot-password
        router.push('/forgot-password')
      }
    }
    checkSession()
  }, [supabase.auth, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter')
      setIsLoading(false)
      return
    }

    if (!/[a-z]/.test(password)) {
      setError('Password must contain at least one lowercase letter')
      setIsLoading(false)
      return
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number')
      setIsLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        setError(updateError.message)
        return
      }

      setSuccess('Password updated successfully! Redirecting to login...')

      // Sign out and redirect to login
      setTimeout(async () => {
        await supabase.auth.signOut()
        router.push('/login')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <img id="hat" src={hatImg.src} alt="Hat logo" />

      <div>
        <h1>Student Mart</h1>
        <p id="des">Create a new password</p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '10px', fontSize: '20px' }}>Reset Password</h2>
        <p style={{ color: 'grey', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
          Enter your new password below.
        </p>

        {error && (
          <div className="error-message" style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" style={{ color: "green", marginBottom: "10px", textAlign: "center" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <br />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p style={{ fontSize: '12px', color: 'grey', marginTop: '15px', textAlign: 'center' }}>
          Password must be at least 8 characters with uppercase, lowercase, and numbers.
        </p>
      </div>
    </div>
  )
}
