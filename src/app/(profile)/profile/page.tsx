'use client'

import React from "react"
import Link from "next/link"
import "../styles.css"
import { useListingStore } from "@/lib/useListingsStore"
import { useUserProfile } from "@/hooks/useUserProfile"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  // Global store for items
  const items = useListingStore((state) => state.items)
  const removeListing = useListingStore((state) => state.removeListing)

  // Fetch user profile
  const { profile, loading, error } = useUserProfile()

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      // SessionMonitor will handle redirect to /login
    } catch (err) {
      console.error('Logout failed:', err)
      alert('Failed to log out. Please try again.')
    }
  }

  if (loading) return <p>Loading profile...</p>
  if (error || !profile) return <p>Error loading profile: {error || 'Profile not found'}</p>

  // Filter user's items from store
  const userItems = items.filter(
    (item) => item.postedBy.name === `${profile.first_name} ${profile.last_name}`
  )

  // Sort user's items by most recent first
  const sortedUserItems = [...userItems].sort((a, b) => {
    const dateA = new Date(a.postedAt ?? 0).getTime()
    const dateB = new Date(b.postedAt ?? 0).getTime()
    return dateB - dateA // latest first
  })

  return (
    <div className="profile-page">

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-pic-info">
          {profile.avatar_url ? (
            <img
              className="profile-pic"
              src={profile.avatar_url}
              alt={`${profile.first_name} ${profile.last_name}`}
            />
          ) : (
            <div className="profile-pic profile-pic-placeholder">
              {profile.first_name?.[0]}{profile.last_name?.[0]}
            </div>
          )}

          <div className="profile-info">
            <p className="profile-name">{profile.first_name} {profile.last_name}</p>
            <p className="profile-email">{profile.email}</p>
          </div>
        </div>

        <div className="profile-butts">
          <Link href="/editprofile">
            <button className="profile-butts1">Edit Profile</button>
          </Link>
          <button className="profile-butts1" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      {/* Profile Stats */}
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
          {sortedUserItems.length > 0 ? (
            sortedUserItems.map((item) => (
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
                    {item.postedAt ? new Date(item.postedAt).toLocaleString() : ""}
                  </p>
                  <button onClick={() => window.location.href = `/edit-listing/${item.id}`}>Edit</button>
                  <button onClick={() => removeListing(item.id)}>Mark Sold</button>
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
