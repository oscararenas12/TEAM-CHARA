'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import hatImg from "@/assets/hat.png"
import "../login/styles.css"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // Validate CSULB email
    if (!email.endsWith('@student.csulb.edu')) {
      setError('Please use your CSULB student email')
      setIsLoading(false)
      return
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setSuccess('Check your email for a password reset link')
      setEmail('')
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
        <p id="des">Reset your password</p>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '10px', fontSize: '20px' }}>Forgot Password</h2>
        <p style={{ color: 'grey', fontSize: '14px', textAlign: 'center', marginBottom: '20px' }}>
          Enter your email and we'll send you a link to reset your password.
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
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email@student.csulb.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <button
          onClick={() => router.push('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgb(0, 41, 188)',
            marginTop: '15px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}
