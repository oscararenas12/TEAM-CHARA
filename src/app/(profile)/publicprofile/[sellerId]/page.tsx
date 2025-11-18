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
  const [userRating, setUserRating] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [ratingMessage, setRatingMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Fetch current user ID
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUserId(user?.id || null)
      } catch (err) {
        // Silent fail - user can still view profile
      }
    }
    fetchCurrentUser()
  }, [])

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
        // Silent fail - items section will show empty
      } finally {
        setLoadingItems(false)
      }
    }

    fetchSellerItems()
  }, [sellerId])

  // Fetch user's existing rating for this seller
  useEffect(() => {
    async function fetchUserRating() {
      if (!currentUserId || !sellerId) return

      try {
        const supabase = createClient()

        const { data, error } = await supabase
          .from('reviews')
          .select('rating')
          .eq('reviewer_id', currentUserId)
          .eq('reviewee_id', sellerId)
          .maybeSingle()

        if (error && error.code !== 'PGRST116') {
          return
        }

        if (data) {
          setUserRating(data.rating)
        }
      } catch (err) {
        // Silent fail - rating will show as unrated
      }
    }

    fetchUserRating()
  }, [currentUserId, sellerId])

  // Handle user rating submission
  async function handleRating(value: number) {
    // Clear previous messages
    setRatingMessage(null)

    // Validation
    if (!currentUserId) {
      setRatingMessage({ type: 'error', text: 'You must be logged in to rate' })
      return
    }

    if (currentUserId === sellerId) {
      setRatingMessage({ type: 'error', text: 'You cannot rate yourself!' })
      return
    }

    // Optimistic UI update - update stars immediately
    const previousRating = userRating
    setUserRating(value)

    try {
      setSubmitting(true)
      const supabase = createClient()

      // Check if user already rated this seller
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('reviewer_id', currentUserId)
        .eq('reviewee_id', sellerId)
        .maybeSingle()

      if (existingReview) {
        // Update existing review
        const { data: updateData, error: updateError, count } = await supabase
          .from('reviews')
          .update({ rating: value })
          .eq('id', existingReview.id)
          .select()

        if (updateError) {
          setUserRating(previousRating) // Revert on error
          setRatingMessage({ type: 'error', text: `Failed to update rating: ${updateError.message}` })
          return
        }

        if (!updateData || updateData.length === 0) {
          setUserRating(previousRating) // Revert on error
          setRatingMessage({ type: 'error', text: 'Failed to update rating: No rows updated' })
          return
        }
      } else {
        // Insert new review
        const { error: insertError } = await supabase
          .from('reviews')
          .insert({
            reviewer_id: currentUserId,
            reviewee_id: sellerId,
            rating: value,
          })

        if (insertError) {
          setUserRating(previousRating) // Revert on error
          setRatingMessage({ type: 'error', text: 'Failed to submit rating' })
          return
        }
      }

      // Calculate new average rating
      const { data: allReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', sellerId)

      if (reviewsError) {
        setUserRating(previousRating) // Revert on error
        setRatingMessage({ type: 'error', text: 'Rating submitted but failed to update average' })
        return
      }

      // Calculate average
      const totalRatings = allReviews?.length || 0
      const sumRatings = allReviews?.reduce((sum, review) => sum + review.rating, 0) || 0
      const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0

      // Update profile with new average rating
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ rating: averageRating })
        .eq('id', sellerId)

      if (profileError) {
        setUserRating(previousRating) // Revert on error
        setRatingMessage({ type: 'error', text: 'Rating submitted but failed to update profile' })
        return
      }

      // Update profile with new average (userRating already updated optimistically)
      setProfile((prev) => prev ? { ...prev, rating: averageRating } : prev)
      setRatingMessage({
        type: 'success',
        text: existingReview ? 'Rating updated successfully!' : 'Rating submitted successfully!'
      })

      // Auto-dismiss after 3 seconds
      setTimeout(() => setRatingMessage(null), 3000)
    } catch (err) {
      setUserRating(previousRating) // Revert on error
      setRatingMessage({ type: 'error', text: 'Failed to submit rating' })
    } finally {
      setSubmitting(false)
    }
  }

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
          <Link href={`/messages?to=${profile.id}`}>
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
          <p className="info2">{profile.rating ? profile.rating.toFixed(1) : "0.0"}</p>
          <p className="info3">Overall Rating</p>
        </div>
      </div>

      {/* ======== RATING BOX (Only show if not viewing own profile) ======== */}
      {currentUserId && currentUserId !== sellerId && (
        <div className="rating-box">
          <h3>{userRating ? 'Update Your Rating' : 'Rate this Seller'}</h3>
          <p>
            {userRating
              ? `You rated this seller ${userRating} star${userRating > 1 ? 's' : ''}. Click to update:`
              : 'Click on the stars below to leave your rating:'}
          </p>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => !submitting && handleRating(star)}
                style={{
                  cursor: submitting ? "not-allowed" : "pointer",
                  color: userRating && star <= userRating ? "#FFD700" : "#ccc",
                  fontSize: "24px",
                  margin: "0 3px",
                  transition: "color 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    e.currentTarget.style.transform = "scale(1.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                ★
              </span>
            ))}
          </div>
          {ratingMessage && (
            <p
              style={{
                marginTop: '10px',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: ratingMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                color: ratingMessage.type === 'success' ? '#155724' : '#721c24',
                border: `1px solid ${ratingMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              {ratingMessage.text}
            </p>
          )}
        </div>
      )}

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
                  <Link href={`/messages?to=${profile.id}`}>
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
