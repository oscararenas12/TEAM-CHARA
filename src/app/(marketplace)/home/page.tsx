'use client';

import React, { useState } from "react"
import Link from "next/link"
import "../styles.css"
import laptopImg from "@/assets/laptop.jpeg"
import hatImg from "@/assets/hat.png"
import cartImg from "@/assets/cart.png"
import heartemImg from "@/assets/heartempty.png"
import heartImg from "@/assets/heart.png"
import { useUserProfile } from "@/hooks/useUserProfile"

export default function HomePage() {
  const { profile } = useUserProfile()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [likedItems, setLikedItems] = useState<number[]>([])

  const items = [
    {
      id: 1,
      name: "Laptop",
      category: "Electronics",
      price: "$500",
      condition: "like-new",
      postedBy: { name: "Alice Johnson", profilePic: "" },
      postedAt: "2025-01-10T10:00:00",
      images: [
        laptopImg.src,
        "https://via.placeholder.com/300x200?text=Laptop+2",
        "https://via.placeholder.com/300x200?text=Laptop+3",
      ],
    },
    {
      id: 2,
      name: "Headphones",
      category: "Electronics",
      price: "$40",
      condition: "good",
      postedBy: { name: "Ryan Smith", profilePic: "" },
      postedAt: "2025-01-09T14:30:00",
      images: [
        "https://via.placeholder.com/300x200?text=Headphones+1",
        "https://via.placeholder.com/300x200?text=Headphones+2",
      ],
    },
    {
      id: 3,
      name: "Backpack",
      category: "Accessories",
      price: "$30",
      condition: "fair",
      postedBy: { name: "Sophie Chen", profilePic: "" },
      postedAt: "2025-01-08T09:15:00",
      images: [
        "https://via.placeholder.com/300x200?text=Backpack+1",
        "https://via.placeholder.com/300x200?text=Backpack+2",
      ],
    },
    {
      id: 4,
      name: "Camera",
      category: "Electronics",
      price: "$250",
      condition: "like-new",
      postedBy: { name: "Daniel Lee", profilePic: "" },
      postedAt: "2025-01-07T16:45:00",
      images: [
        "https://via.placeholder.com/300x200?text=Camera+1",
        "https://via.placeholder.com/300x200?text=Camera+2",
      ],
    },
  ]

  const categories = ["All", ...new Set(items.map(item => item.category))]

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleLike = (itemId: number) => {
    setLikedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  return (
    <div className="homepage-wrapper">
      {/* Header */}
      <div className="home-head1">
        <div className="home-head2">
          <img id="hat-home" src={hatImg.src} alt="Hat logo" />
          <div>
            <h1 id="page-head">Student Mart</h1>
            {profile && (
              <p style={{ fontSize: '14px', color: '#666', margin: '0' }}>
                Welcome, {profile.first_name || 'Guest'}
              </p>
            )}
          </div>
        </div>
        <div className="icon-cart">
          <Link href="/cart">
            <img className="cart-icon" src={cartImg.src} alt="cart" />
          </Link>
        </div>
      </div>

      <p id="line">Find what you need, Sell what you don't</p>

      {/* Search + Category */}
      <input
        type="text"
        placeholder="Search..."
        className="Search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className="category-filter"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Item Cards */}
      <div className="items-wrapper">
        <div className="item-container">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isLiked = likedItems.includes(item.id);

              return (
                <Link href={`/item/${item.id}`} key={item.id} className="item-card">
                  <img className="item-img" src={item.images[0] || laptopImg.src} alt={item.name} />

                  <button
                    className={`heart-btn ${isLiked ? "liked" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleLike(item.id);
                    }}
                  >
                    <img className="heart-icon" src={isLiked ? heartImg.src : heartemImg.src} alt="heart" />
                  </button>

                  <div className="item-card-price-like">
                    <p id="name">{item.name}</p>
                    <p id="price">{item.price}</p>
                  </div>

                  <p className="condition con2">{item.condition}</p>
                  <hr className="list-divider" />

                  <div className="listed-item-sec">
                    <div className="item-av">
                      {item.postedBy.profilePic ? (
                        <img className="seller-avatar av2" src={item.postedBy.profilePic} alt={item.postedBy.name} />
                      ) : (
                        <div className="seller-avatar av2">{item.postedBy.name.charAt(0).toUpperCase()}</div>
                      )}
                      <p className="posted-by">{item.postedBy.name}</p>
                    </div>

                    <p className="posted-date"> {new Date(item.postedAt).toLocaleDateString()} </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="no-items">No items found 😕</p>
          )}
        </div>
      </div>
    </div>
  );
}
