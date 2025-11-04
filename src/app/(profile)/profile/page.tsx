'use client'

import React from "react"
import Link from "next/link"
import "../styles.css"
import { useListingStore } from "@/lib/useListingsStore"

export default function ProfilePage() {
  // ✅ Global user and items
  const user = useListingStore((state) => state.user)
  const items = useListingStore((state) => state.items)
  const removeListing = useListingStore((state) => state.removeListing)

  // Filter items posted by this user (directly from global state)
const userItems = items.filter(
  (item) => item.postedBy.name === `${user.firstName} ${user.lastName}`
)
import { useUserProfile } from "@/hooks/useUserProfile"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const { profile, loading, error } = useUserProfile()

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      // SessionMonitor will automatically redirect to /login
    } catch (error) {
      console.error('Logout failed:', error)
      alert('Failed to log out. Please try again.')
    }
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
      <div className="profile-header">
        <div className="profile-pic-info">
          {user.profilePic ? (
            <img
              className="profile-pic"
              src={user.profilePic}
              alt={`${user.firstName} ${user.lastName}`}
            />
          ) : (
            <div className="profile-pic fallback-avatar">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="profile-info">
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.email}</p>
          </div>
        </div>


        {/* ===== Profile Header ===== */}
  <div className="profile-header">

    {/* --- Profile Picture & Info --- */}
    <div className="profile-pic-info">
      {profile.avatar_url ? (
        <img
          className="profile-pic"
          src={profile.avatar_url}
          alt={profile.first_name || profile.last_name
            ? `${profile.first_name || ''} ${profile.last_name || ''} profile`.trim()
            : 'User profile'}
        />
      ) : (
        <div className="profile-pic profile-pic-placeholder">
          {profile.first_name?.[0]}{profile.last_name?.[0]}
        </div>
      )}
      <div className="profile-info">
        <h2>
          {profile.first_name || profile.last_name
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
            : 'Anonymous User'}
        </h2>
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

      {/* User Listings */}
      <div className="user-items profile-content-wrapper">
        <div className="listings">
          <h3>Your Listings</h3>
          <Link href="/sell">
            <button>Create New Listing</button>
          </Link>
        </div>

        <div className="profile-item-cont item-container">
          {userItems.length > 0 ? (
            userItems.map((item) => (
              <div key={item.id} className="profile-items">
                <img className="item-img" src={item.images[0]} alt={item.name} />

                <div className="item-card-price-like">
                  <p id="name">{item.name}</p>
                  <p id="price">{item.price}</p>
                </div>

                <p className="condition con2">{item.condition}</p>
                <hr className="list-divider" />

                <div className="profile-item-last">
                  <p className="posted-date">
                    {item.postedAt ? new Date(item.postedAt).toLocaleDateString() : ""}
                  </p>

                  <button
                    onClick={() => window.location.href = `/edit-listing/${item.id}`}
                  >
                    Edit
                  </button>

                  <button onClick={() => removeListing(item.id)}>
                    Mark Sold
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No items listed yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
