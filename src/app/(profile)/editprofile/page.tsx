"use client"

import React, { useState } from "react"
import Link from "next/link"
import "../styles.css" // make sure this includes the updated CSS

export default function EditProfilePage() {

  const [user, setUser] = useState({
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    console.log("Updated profile:", user)
    alert("Profile updated successfully!")
  }

  const handleCancel = () => {
    window.location.href = "/profile"
  }

  return (
    <div className="edit-profile-container">

      {/* ✅ Header */}
      <div className="edit-profile-header">
        <div className="edit-profile-img-wrapper">
          <img
            className="edit-profile-img"
            alt={`${user.firstName} ${user.lastName}`}
            src="https://via.placeholder.com/120"
          />
          <span className="change-photo-btn">Change photo</span>
        </div>

        <div>
          <h2>Edit Profile</h2>
          <p>Update your information below</p>
        </div>
      </div>

      {/* ✅ Form */}
      <div className="edit-form">

        <div>
          <label>First Name</label>
          <input
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            type="text"
          />
        </div>

        <div>
          <label>Last Name</label>
          <input
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            type="text"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            value={user.email}
            onChange={handleChange}
            type="email"
          />
        </div>
      </div>

      {/* ✅ Buttons */}
      <div className="edit-actions">
        <button className="edit-btn cancel" onClick={handleCancel}>Cancel</button>
        <button className="edit-btn save" onClick={handleSave}>Save Changes</button>
      </div>

    </div>
  )
}
