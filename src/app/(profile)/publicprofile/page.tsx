'use client'

import React from "react"
import "../styles.css"
import { useListingStore } from "@/lib/useListingsStore"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function PublicProfilePage() {
  const { userId } = useParams() // assume URL is /public-profile/[userId]
  
  // Global store for items
  const items = useListingStore((state) => state.items)

  // Fetch user profile by userId
  const { profile, loading, error } = useUserProfile(userId)

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
    return dateB - dateA
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
            {profile.bio && <p className="profile-email">{profile.bio}</p>}
          </div>
        </div>

        {/* Send Message Button */}
        <div className="profile-butts">
          <Link href={`/messages/${profile.id}`}>
            <button className="profile-butts1">Send Message</button>
          </Link>
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

      {/* Public Listings */}
      <div className="user-items profile-content-wrapper">
        <div className="listings">
          <h3>{profile.first_name}'s Listings</h3>
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
                <p className="posted-date">
                  {item.postedAt ? new Date(item.postedAt).toLocaleString() : ""}
                </p>
                <div className="profile-butts">
                  <Link href={`/listing/${item.id}`}>
                    <button className="profile-butts1">View Item</button>
                  </Link>
                  <Link href={`/messages/${profile.id}`}>
                    <button className="profile-butts1">Send Message</button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No listings available</p>
          )}
        </div>
      </div>
    </div>
  )
}
