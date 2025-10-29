'use client'

import React, { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import "../../styles.css"
import leftImg from "@/assets/left.png"
import rightImg from "@/assets/right.png"
import backImg from "@/assets/back.png"
import messageImg from "@/assets/message.png"
import laptopImg from "@/assets/laptop.jpeg"


interface Item {
  id: number
  name: string
  price: string
  description: string
  images: string[]
  postedBy: string
  condition: string;
  category: string;
}

export default function ItemDetailPage() {
  const params = useParams()
  const itemId = Number(params.id)

  const [user] = useState({
      name: "Alice Johnson",
      email: "alice@example.com",
      rating: "1.5",
      item_sold: "3",
      item_listed: "2"
     
    });
  


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
      condition: "used-like-new",
      category: "electronics"
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
      condition: "used-like-new",
      category: "electronics"
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
      condition: "used-like-new",
      category: "electronics"
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
      condition: "used-like-new",
      category: "electronics"
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


      <div className="box condition">
        <h3>Condition:</h3>
        <p id="condition">{item.condition}</p>

      </div>

      <div className="box description">
        <h3>Description</h3>
        <p className="item-description">{item.description}</p>
      </div>

      {/* Seller Info */}
      <div className="box seller-info-box">
        <h3>Seller Information</h3>
        <div className="seller-info-box1">
          <div className="seller-info-box3">
          <div className="seller-avatar">
  {user.name.charAt(0).toUpperCase()}
</div>
        <div className="seller-info-box2">
          <p>{user.name}</p>
        <p className="rating">★ {user.rating}</p></div></div>
        <Link href="/publicprofile" className="seller-link">
          <button>View Profile</button>
     </Link> </div>
       
      </div>

      {/* Quick Questions */}
       {/* Quick Questions */}
      <div className="box quick-questions-box">
        <h3>Quick Questions</h3>
        <div className="questions">

        <div className="question">
         
          
            <p>  <img  src={messageImg.src} alt="message" />Is this available?</p>

        </div>
        <div className="question">

            <p>  <img  src={messageImg.src} alt="message" />Can I pick up tomorrow?</p>

        </div>
        <div className="question">
          
            <p>  <img src={messageImg.src} alt="message" /> What's the condition like?</p>

        </div>

         <div className="question">
           
            <p>  <img src={messageImg.src} alt="gohome" /> Can you send more photos?</p>

        </div>
        </div>
      
      </div>
    </div>
  );
};

