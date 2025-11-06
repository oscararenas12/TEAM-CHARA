"use client";

import React, { useState } from "react";
import Link from "next/link";
import backImg from "@/assets/back.png";
import deleteImg from "@/assets/delete.png";
import { useListingStore } from "@/lib/useListingsStore";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function Cart() {
  const { profile } = useUserProfile();
  const removeFromCart = useListingStore((state) => state.removeFromCart);

  // mock items with image arrays (for detail page)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Laptop",
      price: "$500",
      postedBy: "Alice",
      images: [
        laptopImg.src,
        "https://via.placeholder.com/300x200?text=Laptop+2",
        "https://via.placeholder.com/300x200?text=Laptop+3",
      ],
      description: "Fast and reliable laptop, perfect for students.",
      condition: "used-like-new",
    },
    {
      id: 2,
      name: "Headphones",
      price: "$40",
      postedBy: "Ryan",
      images: [
        "https://via.placeholder.com/300x200?text=Headphones+1",
        "https://via.placeholder.com/300x200?text=Headphones+2",
      ],
      description: "Noise cancelling headphones, great sound quality.",
    },
    {
      id: 3,
      name: "Backpack",
      price: "$30",
      postedBy: "Sophie",
      images: [
        "https://via.placeholder.com/300x200?text=Backpack+1",
        "https://via.placeholder.com/300x200?text=Backpack+2",
      ],
      description: "Durable and spacious backpack for daily use.",
    },
    {
      id: 4,
      name: "Camera",
      price: "$250",
      postedBy: "Daniel",
      images: [
        "https://via.placeholder.com/300x200?text=Camera+1",
        "https://via.placeholder.com/300x200?text=Camera+2",
        "https://via.placeholder.com/300x200?text=Camera+3",
      ],
      description: "Capture great moments with this professional camera.",
    },
  ]);

  // Placeholder for future Send Message functionality
  const handleSendMessage = (sellerName: string) => {
    window.location.href = `/messages?seller=${encodeURIComponent(sellerName)}`;
  };

  return (
    <div className="item-detail">
      <div className="item-detail-head">
        <Link href="/home" className="back-button">
          <img id="backbut" src={backImg.src} alt="Go home" />
        </Link>
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <Link href={`/item/${item.id}`} className="cart-item-link">
                <div className="cart-item-info">
                  <img
                    className="cart-item-img"
                    src={item.images[0]}
                    alt={item.name}
                  />
                  <div>
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">{item.price}</p>
                  </div>
                </div>
              </Link>

              <div className="cart-butts">
                <button
                  className="remove-btn1"
                  onClick={() => handleSendMessage(item.postedBy)}
                >
                  Send message
                </button>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  <img className="delete" src={deleteImg.src} alt="delete" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-cart">Your cart is empty</p>
        )}
      </div>
    </div>
  );
}
