"use client"

import React, { useState } from "react"
import Link from "next/link"
import "../styles.css"

export default function EditProfilePage() {

  const [user, setUser] = useState({
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
  })

  const [photo, setPhoto] = useState("https://via.placeholder.com/120")

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

  // ✅ New function for photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="edit-profile-container">

      {/* ✅ Header */}
      <div className="edit-profile-header">
        <div>
          <h2>Edit Profile</h2>
          <p>Update your information below</p>
        </div>
        <div className="edit-profile-img-wrapper">
          <img
            className="edit-profile-img"
            alt={`${user.firstName} ${user.lastName}`}
            src={photo}
          />
          
          {/* ✅ Hidden file input + clickable label */}
          <label htmlFor="photo-upload" className="change-photo-btn">
            Change photo
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handlePhotoChange}
          />
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
