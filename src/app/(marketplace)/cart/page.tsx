"use client";

import React from "react";
import Link from "next/link";
import backImg from "@/assets/back.png";
import deleteImg from "@/assets/delete.png";
import { useListingStore } from "@/lib/useListingsStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import laptopImg from "@/assets/laptop.jpeg"; // if you need placeholder images

export default function Cart() {
  const { profile } = useUserProfile();
  const cartItems = useListingStore((state) => state.cart);
  const removeFromCart = useListingStore((state) => state.removeFromCart);

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
                    src={item.images?.[0] || laptopImg.src}
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
