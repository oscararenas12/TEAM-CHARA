"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../styles.css";
import { useListingStore } from "@/lib/useListingsStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import { createClient } from "@/lib/supabase/client";
import laptopImg from "@/assets/laptop.jpeg";

interface UserListing {
  id: string;
  name: string;
  price: string;
  condition: string;
  images: string[];
  postedAt: string;
}

export default function ProfilePage() {
  const [userListings, setUserListings] = useState<UserListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const { profile, loading, error } = useUserProfile();

  useEffect(() => {
    async function fetchUserListings() {
      if (!profile?.id) return;

      try {
        const supabase = createClient();
        const { data: items, error } = await supabase
          .from("items")
          .select(
            `
            id,
            name,
            price,
            condition,
            created_at,
            item_images (
              image_url,
              display_order
            )
          `
          )
          .eq("seller_id", profile.id)
          .eq("is_available", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching user listings:", error);
          return;
        }

        const transformedListings: UserListing[] = (items || []).map(
          (item: any) => ({
            id: item.id,
            name: item.name,
            price: `$${parseFloat(item.price).toFixed(2)}`,
            condition: item.condition || "good",
            postedAt: item.created_at,
            images:
              item.item_images
                ?.toSorted((a: any, b: any) => a.display_order - b.display_order)
                .map((img: any) => img.image_url) || [],
          })
        );

        setUserListings(transformedListings);
      } catch (err) {
        console.error("Unexpected error fetching listings:", err);
      } finally {
        setLoadingListings(false);
      }
    }

    fetchUserListings();
  }, [profile?.id]);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Failed to log out. Please try again.");
    }
  };

  const handleMarkSold = async (itemId: string) => {
    if (!profile?.id) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("items")
        .update({ is_available: false })
        .eq("id", itemId);

      if (error) {
        console.error("Error marking item as sold:", error);
        alert("Failed to mark item as sold");
        return;
      }

      // Update profile counts: increment items_sold, decrement items_listed
      const { error: profileError } = await supabase.rpc('mark_item_sold', {
        user_id: profile.id
      });

      if (profileError) {
        console.error("Error updating profile counts:", profileError);
        // Don't fail the operation, item is already marked as sold
      }

      setUserListings(userListings.filter((item) => item.id !== itemId));
      alert("Item marked as sold!");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Failed to mark item as sold");
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #ffd518',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (error || !profile)
    return <p>Error loading profile: {error || "Profile not found"}</p>;

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
              {profile.first_name?.[0]}
              {profile.last_name?.[0]}
            </div>
          )}

          <div className="profile-info">
            <p className="profile-name">
              {profile.first_name} {profile.last_name}
            </p>
            <p className="profile-email">
              {profile.email}
              {profile.phone && <span> • {profile.phone}</span>}
            </p>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          </div>
        </div>

        <div className="profile-butts">
          <Link href="/editprofile">
            <button className="profile-butts1">Edit Profile</button>
          </Link>
          <button className="profile-butts1" onClick={handleLogout}>
            Log Out
          </button>
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
          {loadingListings ? (
            <p>Loading your listings...</p>
          ) : userListings.length > 0 ? (
            userListings.map((item) => (
              <div key={item.id} className="profile-items">
                <img
                  className="item-img"
                  src={item.images[0] || laptopImg.src}
                  alt={item.name}
                />
                <div className="item-card-price-like">
                  <p id="name">{item.name}</p>
                  <p id="price">{item.price}</p>
                </div>
                <p className="condition con2">{item.condition}</p>
                <hr className="list-divider" />
                <div className="profile-item-last">
                  <p className="posted-date">
                    {item.postedAt
                      ? new Date(item.postedAt).toLocaleDateString()
                      : ""}
                  </p>

                  {/* 👇 NEW BUTTON ADDED HERE */}
                  <Link href={`/item/${item.id}`}>
                    <button>View Item</button>
                  </Link>

                  <button
                    onClick={() =>
                      (window.location.href = `/edit-listing/${item.id}`)
                    }
                  >
                    Edit
                  </button>
                  <button onClick={() => handleMarkSold(item.id)}>
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
  );
}
