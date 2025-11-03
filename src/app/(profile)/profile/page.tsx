'use client'

import React, { useState } from "react"
import Link from "next/link"
import "../styles.css"
import laptopImg from "@/assets/laptop.jpeg"

interface Item {
  id: number
  name: string
  price: string
  postedBy: string
  images: string[]
  description?: string
  postedAt?: string
  condition?: string
}

export default function ProfilePage() {
  const [user] = useState({
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    rating: "1.5",
    item_sold: "3",
    item_listed: "2",
  })

  const [allItems, setAllItems] = useState<Item[]>([
    {
      id: 1,
      name: "Laptop",
      price: "$500",
      postedBy: "Alice Johnson",
      postedAt: new Date().toISOString(),
      images: [
        laptopImg.src,
        "https://via.placeholder.com/300x200?text=Laptop+2",
        "https://via.placeholder.com/300x200?text=Laptop+3",
      ],
      condition: "used-like-new",
    },
    {
      id: 2,
      name: "Headphones",
      price: "$40",
      postedBy: "Alice Johnson",
      postedAt: new Date().toISOString(),
      images: [
        "https://via.placeholder.com/300x200?text=Headphones+1",
        "https://via.placeholder.com/300x200?text=Headphones+2",
      ],
      condition: "new",
    },
  ])

  const userItems = allItems.filter(
    (item) => item.postedBy === `${user.firstName} ${user.lastName}`
  )

  // ✅ Remove item without breaking your design
  const removeItem = (id: number) => {
    setAllItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="profile-page">

      <div className="profile-header">
        <div className="profile-pic-info">
          <img className="profile-pic" alt={`${user.firstName} ${user.lastName}`} />
          <div className="profile-info">
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="profile-butts">
          <Link href="/editprofile"><button className="profile-butts1">Edit Profile</button></Link>
          <Link href="/"><button className="profile-butts1">Log Out</button></Link>
        </div>
      </div>

      <div className="infos-cont">
        <div className="infoss">
          <p className="info2">{user.item_listed}</p>
          <p className="info3">Items Listed</p>
        </div>
        <div className="infoss">
          <p className="info2">{user.item_sold}</p>
          <p className="info3">Items Sold</p>
        </div>
        <div className="infoss">
          <p className="info2">{user.rating}</p>
          <p className="info3">Rating</p>
        </div>
      </div>

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
              
              <Link href={`/item/${item.id}`} key={item.id} className="profile-items">

                <img className="item-img" src={item.images[0]} alt={item.name} />

                <div className="item-card-price-like">
                  <p id="name">{item.name}</p>
                  <p id="price">{item.price}</p>
                </div>

                <p className="condition con2">{item.condition}</p>
                <hr className="list-divider" />

                <div className="profile-item-last">
                  <p className="posted-date">
                    {new Date(item.postedAt!).toLocaleDateString()}
                  </p>

                  {/* ✅ Prevent link click when pressing buttons */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      window.location.href = `/edit-listing`
                    }}
                  >
                    Edit
                  </button>

                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeItem(item.id)
                    }}
                  >
                    Mark Sold
                  </button>

                </div>
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
