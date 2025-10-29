"use client";

import React, { useState } from "react"
import Link from "next/link"
import backImg from "@/assets/back.png"
import laptopImg from "@/assets/laptop.jpeg"
import hatImg from "@/assets/hat.png"
import deleteImg from "@/assets/delete.png"




export default function Cart() {
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
      condition: "used-like-new"
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

   const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);


   return (
    <div className="item-detail">
      <div className="item-detail-head">
        <Link href="/home" className="back-button">
          <img id="backbut" src={backImg.src} alt="gohome" />
        </Link>
      </div>
      {/*==cart items==*/}

    

      <Link href="item" className="cart-items">
      {cartItems.map((item) => (


          <div className="cart-item" key={item.id}>
             

          

            <div className="cart-item-info">

           

              <img className="cart-item-img" src={item.image} alt={item.name} />
              <div>

                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">{item.price}</p>

              </div>

            </div>
            <div className="cart-butts">
            
            <button className="remove-btn1" >
                 Send message</button>
                 
            <button className="remove-btn" onClick={() => removeItem(item.id)}>
              <img className="delete" src={deleteImg.src} alt="delete"></img>
            </button>
            </div>

            
          </div>
        ))}
      </Link>
    
      

      <div className=" cart-items">

      </div>

</div>





   )
}