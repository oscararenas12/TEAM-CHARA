'use client'

import React, { useState } from "react"
import Link from "next/link"
import "../styles.css"

export default function EditProfilePage() {
  // Mock user data (in a real app, you'd fetch this from backend)
  const [user, setUser] = useState({
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
  })

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  // Handle save (for now just logs — later you can connect to backend)
  const handleSave = () => {
    console.log("Updated profile:", user)
    alert("Profile updated successfully!")
  }

  return (
    <div className="profile-page edit-profile">

      {/* ===== Profile Header ===== */}

        <div className="profile-pic-info">
          <img
            className="profile-pic"
            alt={`${user.firstName} ${user.lastName} profile`}
            src="https://via.placeholder.com/100" // placeholder pic
          />
          <div className="profile-info">
            <h2>Edit Profile</h2>
            <p>Update your personal information below</p>
          </div>
        </div>



      {/* ===== Editable Info Section ===== */}
      <div className="infos-edit">

        <div className="infos-edit1" style={{ flex: 1 }}>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            className="profile-input"
          />
        </div>

        <div className="infos-edit1" style={{ flex: 1 }}>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            className="profile-input"
          />
        </div>

        <div className="infos-edit1" style={{ flex: 1 }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="profile-input"
          />
        </div>

      </div>


        <div className="profile-butts">
          <Link href="/profile" className="back-button">
            <button className="profile-butts1">Cancel</button>
          </Link>
          <button className="profile-butts1" onClick={handleSave}>Save Changes</button>
        </div>
    </div>
  )
}
