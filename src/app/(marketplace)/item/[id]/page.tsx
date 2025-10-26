'use client'

import React, { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import "../../styles.css"
import leftImg from "@/assets/left.png"
import rightImg from "@/assets/right.png"
import backImg from "@/assets/back.png"
import laptopImg from "@/assets/laptop.jpeg"

interface Item {
  id: number
  name: string
  price: string
  description: string
  images: string[]
  postedBy: string
}

export default function ItemDetailPage() {
  const params = useParams()
  const itemId = Number(params.id)

  // Mock items (TODO: fetch from Supabase)
  const items: Item[] = [
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
  ]

  const item = items.find((i) => i.id === itemId)

  // For image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!item) return <p>Item not found!</p>

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === item.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? item.images.length - 1 : prev - 1
    )
  }

  const handleQuickQuestion = () => {
    alert(`Message sent to ${item.postedBy}!`)
  }

  return (
    <div className="item-detail">
      <div className="item-detail-head">
        <Link href="/home" className="back-button">
          <img id="backbut" src={backImg.src} alt="gohome" />
        </Link>
      </div>

      {/* Image Carousel */}
      <div className="box item-images-box">
        <button onClick={prevImage}>
          <img src={leftImg.src} alt="goleft" />
        </button>
        <img
          src={item.images[currentImageIndex]}
          alt={`${item.name} ${currentImageIndex + 1}`}
        />
        <button onClick={nextImage}>
          <img src={rightImg.src} alt="goright" />
        </button>
      </div>

      {/* Item Info */}
      <div className="item-info-box">
        <p>{item.name}</p>
        <p className="item-price">{item.price}</p>
      </div>

      <div className="box description">
        <h3>Description</h3>
        <p className="item-description">{item.description}</p>
      </div>

      {/* Seller Info */}
      <div className="box seller-info-box">
        <h3>Seller Information</h3>
        <Link href={`/profile/${item.postedBy}`} className="seller-link">
          {item.postedBy}'s Profile
        </Link>
      </div>

      {/* Quick Questions */}
      <div className="box quick-questions-box">
        <h3>Quick Questions</h3>
        <div className="questions">
          <div className="question">
            <p>Is this available?</p>
          </div>
          <div className="question">
            <p>Can I pick up tomorrow?</p>
          </div>
          <div className="question">
            <p>What's the condition like?</p>
          </div>

          <div className="question">
            <p>Can you send more photos?</p>
          </div>
        </div>
        <button onClick={handleQuickQuestion} className="quick-question-btn">
          Send a message to seller
        </button>
      </div>
    </div>
  )
}
