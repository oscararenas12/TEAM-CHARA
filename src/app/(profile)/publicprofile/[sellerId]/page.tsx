'use client'

import React, { useState, useEffect } from "react"
import "../../styles.css"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import laptopImg from "@/assets/laptop.jpeg"

interface SellerListing {
  id: string
  name: string
  price: string
  condition: string
  images: string[]
  postedAt: string
}

interface Profile {
  id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  bio: string | null
  items_listed: number
  items_sold: number
  rating: number
}

export default function PublicProfilePage() {
  const params = useParams()
  const sellerId = params.sellerId as string

  const [profile, setProfile] = useState<Profile | null>(null)
  const [sellerItems, setSellerItems] = useState<SellerListing[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingItems, setLoadingItems] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch seller profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const supabase = createClient()

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', sellerId)
          .single()

        if (error || !data) {
          setError('Profile not found')
          return
        }

        setProfile(data)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [sellerId])

  // Fetch seller's items
  useEffect(() => {
    async function fetchSellerItems() {
      try {
        const supabase = createClient()

        const { data: items, error } = await supabase
          .from('items')
          .select(`
            id,
            name,
            price,
            condition,
            created_at,
            item_images (
              image_url,
              display_order
            )
          `)
          .eq('seller_id', sellerId)
          .eq('is_available', true)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching seller items:', error)
          return
        }

        const transformedItems: SellerListing[] = (items || []).map((item: any) => ({
          id: item.id,
          name: item.name,
          price: `$${parseFloat(item.price).toFixed(2)}`,
          condition: item.condition || 'good',
          postedAt: item.created_at,
          images: item.item_images
            ?.toSorted((a: any, b: any) => a.display_order - b.display_order)
            .map((img: any) => img.image_url) || [],
        }))

        setSellerItems(transformedItems)
      } catch (err) {
        console.error('Error fetching items:', err)
      } finally {
        setLoadingItems(false)
      }
    }

    fetchSellerItems()
  }, [sellerId])

  if (loading) return <p>Loading profile...</p>
  if (error || !profile) return <p>Error loading profile: {error || 'Profile not found'}</p>

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-pic-info">
          {profile.avatar_url ? (
            <img
              className="profile-pic"
              src={profile.avatar_url}
              alt={profile.first_name && profile.last_name
                ? `${profile.first_name} ${profile.last_name}`
                : "Profile picture"}
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
          {loadingItems ? (
            <p>Loading listings...</p>
          ) : sellerItems.length > 0 ? (
            sellerItems.map((item) => (
              <div key={item.id} className="profile-items">
                <img className="item-img" src={item.images[0] || laptopImg.src} alt={item.name} />
                <div className="item-card-price-like">
                  <p id="name">{item.name}</p>
                  <p id="price">{item.price}</p>
                </div>
                <p className="condition con2">{item.condition}</p>
                <p className="posted-date">
                  {item.postedAt ? new Date(item.postedAt).toLocaleDateString() : ""}
                </p>
                <div className="profile-butts">
                  <Link href={`/item/${item.id}`}>
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
