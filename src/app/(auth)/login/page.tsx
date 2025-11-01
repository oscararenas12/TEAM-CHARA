'use client'

import React, { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import hatImg from "@/assets/hat.png"
import trustImg from "@/assets/shield.png"
import hat2Img from "@/assets/graduation.png"
import communityImg from "@/assets/people.png"
import "./styles.css"

interface LoginCredentials {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isLoginPage = pathname === "/login"
  const isSignupPage = pathname === "/signup"

  // Check for email verification success or error from URL params
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get('verified') === 'true') {
      setSuccess('Email confirmed! You can now log in.')
    }
    if (params.get('error') === 'email_not_verified') {
      setError('Please verify your email before accessing the app. Check your inbox for the verification link.')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (signInError) {
        // Generic message for security - don't reveal if email exists
        setError("Invalid email or password")
        return
      }

      if (data.user) {
        router.push("/home")
        router.refresh()
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="login-page">
      <img id="hat" src={hatImg.src} alt="Hat logo" />

      <div>
        <h1>Student Mart</h1>
        <p id="des">Buy and Sell within your college community</p>

        <div className="points-container">
          <div className="point">
            <img src={trustImg.src} alt="trust" />
            <p>Verified Student Only</p>
          </div>
          <div className="point">
            <img src={communityImg.src} alt="community" />
            <p>Trusted Community</p>
          </div>
          <div className="point">
            <img src={hat2Img.src} alt="hat2" />
            <p>Campus Focus</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="nav-buttons-cont">
          <div className="nav-buttons">
            <button
              className={isLoginPage ? "active" : ""}
              onClick={() => router.push("/login")}
            >
              Login
            </button>
            <button
              className={isSignupPage ? "active" : ""}
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>

        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="success-message"
            style={{ color: "green", marginBottom: "10px", textAlign: "center" }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email@student.csulb.edu"
            value={credentials.email}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />{" "}
          <br />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <p className="under-card">
        By signing up, you agree to verify your student status
      </p>
    </div>
  )
}
