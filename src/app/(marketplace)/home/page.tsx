'use client'

import React, { useState } from "react"
import Link from "next/link"
import "../styles.css"
import laptopImg from "@/assets/laptop.jpeg"
import hatImg from "@/assets/hat.png"
import cartImg from "@/assets/cart.png"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [likedItems, setLikedItems] = useState<number[]>([])

  const items = [
    {
      id: 1,
      name: "Laptop",
      category: "Electronics",
      price: "$500",
      postedBy: "Alice",
      images: [laptopImg.src],
    },
    {
      id: 2,
      name: "Headphones",
      category: "Electronics",
      price: "$40",
      postedBy: "Ryan",
      images: ["https://via.placeholder.com/300x200?text=Headphones+1"],
    },
    {
      id: 3,
      name: "Backpack",
      category: "Accessories",
      price: "$30",
      postedBy: "Sophie",
      images: ["https://via.placeholder.com/300x200?text=Backpack+1"],
    },
    {
      id: 4,
      name: "Camera",
      category: "Electronics",
      price: "$250",
      postedBy: "Daniel",
      images: ["https://via.placeholder.com/300x200?text=Camera+1"],
    },
  ]

  const categories = ["All", ...new Set(items.map((item) => item.category))]

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Toggle heart like
  const toggleLike = (itemId: number) => {
    if (likedItems.includes(itemId)) {
      setLikedItems(likedItems.filter((id) => id !== itemId))
    } else {
      setLikedItems([...likedItems, itemId])
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="home-head1">
        <div className="home-head2">
          <img id="hat-home" src={hatImg.src} alt="Hat logo" />
          <h1 id="page-head">Student Mart</h1>
        </div>
        <div className="icon-cart">
          <Link href="/cart" className="cart">
            <img className="cart-icon" src={cartImg.src} alt="cart" />
          </Link>
        </div>
      </div>

      <p id="line">Find what you need, Sell what you don't</p>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        className="Search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Category filter */}
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

      {/* Items */}
      <div className="items-wrapper">
        <div className="item-container">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isLiked = likedItems.includes(item.id)
              return (
                <div key={item.id} className="item-card">
                  <Link href={`/item/${item.id}`}>
                    <img
                      className="item-img"
                      src={item.images[0] || laptopImg.src}
                      alt={item.name}
                    />
                    <h3>{item.name}</h3>
                    <p>{item.price}</p>
                    <p className="posted-by">Posted by: {item.postedBy}</p>
                  </Link>

                  {/* Heart button outside the Link */}
                  <button
                    className={`heart-btn ${isLiked ? "liked" : ""}`}
                    onClick={() => toggleLike(item.id)}
                  >
                    ❤️
                  </button>
                </div>
              )
            })
          ) : (
            <p className="no-items">No items found 😕</p>
          )}
        </div>
      </div>
    </div>
  )
}
