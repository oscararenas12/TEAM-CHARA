'use client';

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import "../../styles.css";
import leftImg from "@/assets/left.png";
import rightImg from "@/assets/right.png";
import backImg from "@/assets/back.png";
import messageImg from "@/assets/message.png";
import laptopImg from "@/assets/laptop.jpeg";

interface Item {
  id: number;
  name: string;
  price: string;
  description: string;
  images: string[];
  postedBy: {
    name: string;
    profilePic?: string;
  };
  condition: string;
  category: string;
}

export default function ItemDetailPage() {
  const params = useParams();
  const itemId = Number(params.id);
  const router = useRouter();

  // Mock data
  const items: Item[] = [
    {
      id: 1,
      name: "Laptop",
      price: "$500",
      postedBy: {
        name: "Alice Johnson",
        profilePic: "",
      },
      images: [
        laptopImg.src,
        "https://via.placeholder.com/300x200?text=Laptop+2",
        "https://via.placeholder.com/300x200?text=Laptop+3",
      ],
      description: "Fast and reliable laptop, perfect for students.",
      condition: "used-like-new",
      category: "electronics",
    },
    {
      id: 2,
      name: "Headphones",
      price: "$40",
      postedBy: {
        name: "Ryan Smith",
        profilePic: "",
      },
      images: [
        "https://via.placeholder.com/300x200?text=Headphones+1",
        "https://via.placeholder.com/300x200?text=Headphones+2",
      ],
      description: "Noise cancelling headphones, great sound quality.",
      condition: "used-like-new",
      category: "electronics",
    },
  ];

  const item = items.find((i) => i.id === itemId);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!item) return <p>Item not found!</p>;

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev === item.images.length - 1 ? 0 : prev + 1));

  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? item.images.length - 1 : prev - 1));

  const sendQuickMessage = (text: string) => {
    router.push(
      `/inbox?autoMessage=${encodeURIComponent(text)}&to=${encodeURIComponent(item.postedBy.name)}`
    );
  };

  return (
    <div className="item-detail">
      {/* Back button */}
      <div className="item-detail-head">
        <Link href="/home" className="back-button">
          <img id="backbut" src={backImg.src} alt="Go home" />
        </Link>
      </div>

      {/* Image carousel */}
      <div className="box item-images-box">
        <button onClick={prevImage}>
          <img src={leftImg.src} alt="Go left" />
        </button>
        <img src={item.images[currentImageIndex]} alt={`${item.name} ${currentImageIndex + 1}`} />
        <button onClick={nextImage}>
          <img src={rightImg.src} alt="Go right" />
        </button>
      </div>

      {/* Item info */}
      <div className="item-info-box">
        <p>{item.name}</p>
        <p className="item-price">{item.price}</p>
      </div>

      {/* Condition */}
      <div className="box condition1">
        <h3>Condition:</h3>
        <p className="condition">{item.condition}</p>
      </div>

      {/* Description */}
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
              {item.postedBy.profilePic
                ? <img src={item.postedBy.profilePic} alt={item.postedBy.name} />
                : item.postedBy.name.charAt(0).toUpperCase()}
            </div>
            <div className="seller-info-box2">
              <p>{item.postedBy.name}</p>
            </div>
          </div>
          <Link href="/publicprofile" className="seller-link">
            <button>View Profile</button>
          </Link>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="box quick-questions-box">
        <h3>Quick Questions</h3>
        <div className="questions">
          {["Is this available?", "Can I pick up tomorrow?", "What's the condition like?", "Can you send more photos?"].map((q, i) => (
            <div key={i} className="question" onClick={() => sendQuickMessage(q)}>
              <p><img src={messageImg.src} /> {q}</p>
            </div>
          ))}
          <Link href={`/inbox?to=${encodeURIComponent(item.postedBy.name)}`}>
            <button className="question-send">Send Message</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
