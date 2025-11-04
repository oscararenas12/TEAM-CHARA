'use client';

import React, { useState, useMemo } from "react";
import Link from "next/link";
import "../styles.css";
import laptopImg from "@/assets/laptop.jpeg";
import hatImg from "@/assets/hat.png";
import cartImg from "@/assets/cart.png";
import heartemImg from "@/assets/heartempty.png";
import heartImg from "@/assets/heart.png";
import { useListingStore } from "@/lib/useListingsStore";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Zustand global state
  const items = useListingStore((state) => state.items);
  const toggleLike = useListingStore((state) => state.toggleLike);
  const addToCart = useListingStore((state) => state.addToCart);

  // Categories
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items]
  );

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => selectedCategory === "All" || item.category === selectedCategory)
      .filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.postedAt || Date.now()).getTime() - new Date(a.postedAt || Date.now()).getTime());
  }, [items, searchTerm, selectedCategory]);

  return (
    <div className="homepage-wrapper">
      {/* Header */}
      <div className="home-head1">
        <div className="home-head2">
          <img id="hat-home" src={hatImg.src} alt="Hat logo" />
          <h1 id="page-head">Student Mart</h1>
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
              const isLiked = !!item.liked;

              return (
                <Link href={`/item/${item.id}`} key={item.id} className="item-card">
                  <img className="item-img" src={item.images[0] || laptopImg.src} alt={item.name} />

                  <button
                    className={`heart-btn ${isLiked ? "liked" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleLike(item.id);
                      if (!isLiked) addToCart(item); // optional
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
