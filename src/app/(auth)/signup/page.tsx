'use client'

import React, { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import hatImg from "@/assets/hat.png"
import trustImg from "@/assets/shield.png"
import hat2Img from "@/assets/graduation.png"
import communityImg from "@/assets/people.png"
import "../login/styles.css"

interface SignupCredentials {
  firstName: string
  lastName: string
  email: string
  studentId: string
  password: string
}

const CSULB_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@student\.csulb\.edu$/

export default function SignupPage() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const [credentials, setCredentials] = useState<SignupCredentials>({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isLoginPage = pathname === "/login"
  const isSignupPage = pathname === "/signup"

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // Validate CSULB email
    if (!CSULB_EMAIL_REGEX.test(credentials.email)) {
      setError("Please use your CSULB student email (@student.csulb.edu)")
      setIsLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName,
            last_name: credentials.lastName,
            student_id: credentials.studentId,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.user) {
        setSuccess("Account created! Please check your email to verify your account.")
        // Clear form
        setCredentials({
          firstName: "",
          lastName: "",
          email: "",
          studentId: "",
          password: "",
        })
      }
    } catch (err) {
      setError("Signup failed. Please try again.")
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
    <div className="signup-page">
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

        <form onSubmit={handleSignup}>
          <label htmlFor="firstName">First Name</label>
          <input
            name="firstName"
            type="text"
            placeholder="First Name"
            value={credentials.firstName}
            onChange={handleInputChange}
            required
          />{" "}
          <br />
          <label htmlFor="lastName">Last Name</label>
          <input
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={credentials.lastName}
            onChange={handleInputChange}
            required
          />{" "}
          <br />
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email@student.csulb.edu"
            value={credentials.email}
            onChange={handleInputChange}
            required
          />{" "}
          <br />
          <label htmlFor="studentId">Student ID</label>
          <input
            name="studentId"
            type="text"
            placeholder="Student ID"
            value={credentials.studentId}
            onChange={handleInputChange}
            required
          />{" "}
          <br />
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
            required
            minLength={6}
          />{" "}
          <br />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
      <p className="under-card">
        By signing up, you agree to verify your student status
      </p>
    </div>
  )
}
