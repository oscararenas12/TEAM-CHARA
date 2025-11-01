'use client'

import React from "react"
import Link from "next/link"
import "../styles.css"
import { useUserProfile } from "@/hooks/useUserProfile"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const { profile, loading, error } = useUserProfile()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Error loading profile: {error || 'Profile not found'}</p>
      </div>
    )
  }

  // TODO: Fetch user's items from Supabase items table
  const userItems: any[] = []

  return (
    <div className="profile-page">
      {/* Profile Header */}


        {/* ===== Profile Header ===== */}
  <div className="profile-header">

    {/* --- Profile Picture & Info --- */}
    <div className="profile-pic-info">
      <img
        className="profile-pic"
        src={profile.avatar_url || undefined}
        alt={`${profile.first_name} ${profile.last_name} profile`}
      />
      <div className="profile-info">
        <h2>{profile.first_name} {profile.last_name}</h2>
        <p>{profile.email}</p>
      </div>
    </div>

    {/* --- Profile Buttons --- */}
    <div className="profile-butts">
       <Link href="/editprofile" className="back-button">
      <button className="profile-butts1">Edit Profile</button></Link>
      <button className="profile-butts1" onClick={handleLogout}>Log Out</button>
    </div>

  </div>

  <div className="infos-cont">
    <div className="infoss">
      <p className="info2">{profile.items_listed}</p>
      <p className="info3">Items Listed</p>
    </div>
    <div className="infoss">
      <p className="info2">{profile.items_sold}</p>
       <p className="info3">Items Sold</p>
    </div>

    <div className="infoss">
      <p className="info2">{profile.rating.toFixed(1)}</p>
       <p className="info3">Rating</p>
    </div>
  </div>

      {/* User Items */}
      <div className="user-items">
        <div className="listings">
        <h3>Your Listings</h3>
        <Link href="/sell" className="back-button">
        <button>Create New Listing</button></Link>
        </div>
        <div className="profile-item-cont item-container ">
          {userItems.length > 0 ? (
            userItems.map((item) => (
              <Link
                href={`/item/${item.id}`}
                key={item.id}
                className="profile-items"
              >
                <img
                  className="item-img"
                  src={item.images[0] || "https://via.placeholder.com/300x200"}
                  alt={item.name}
                />
                <h3>{item.name}</h3>
                <p>{item.price}</p>
              </Link>
            ))
          ) : (
            <p>No items listed yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
