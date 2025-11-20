import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import hatImg from "../../../assets/hat.png";

interface Item {
  id: number;
  name: string;
  price: string;
  postedBy: string;
  images: string[];
  description: string;
}

function Profile() {
  // Mock logged-in user
  const [user] = useState({
    name: "Alice Johnson",
    email: "alice@example.com",
    rating: "1.5",
    item_sold: "3",
    item_listed: "2"
   
  });

  // Mock all items in the marketplace
  const [allItems] = useState<Item[]>([
    {
      id: 1,
      name: "Laptop",
      price: "$500",
      postedBy: "Alice Johnson",
      images: [
        "https://via.placeholder.com/300x200?text=Laptop+1",
        "https://via.placeholder.com/300x200?text=Laptop+2",
      ],
      description: "Fast and reliable laptop, perfect for students.",
    },
    {
      id: 2,
      name: "Headphones",
      price: "$40",
      postedBy: "Ryan Smith",
      images: ["https://via.placeholder.com/300x200?text=Headphones+1"],
      description: "Noise cancelling headphones, great sound quality.",
    },
    {
      id: 3,
      name: "Backpack",
      price: "$30",
      postedBy: "Alice Johnson",
      images: [
        "https://via.placeholder.com/300x200?text=Backpack+1",
        "https://via.placeholder.com/300x200?text=Backpack+2",
      ],
      description: "Durable and spacious backpack for daily use.",
    },
  ]);

  // Only show items posted by this user
  const userItems = allItems.filter((item) => item.postedBy === user.name);

  return (
    <div className="profile-page">
      {/* Profile Header */}


        {/* ===== Profile Header ===== */}
  <div className="profile-header">

    {/* --- Profile Picture & Info --- */}
    <div className="profile-pic-info">
      <img
        className="profile-pic"
        alt={`${user.name} profile`}
      />
      <div className="profile-info">
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>

    {/* --- Profile Buttons --- */}
    <div className="profile-butts">
       <Link to="/editprofile" className="back-button">
      <button className="profile-butts1">Edit Profile</button></Link>
       <Link to="/" className="back-button">
      <button className="profile-butts1">Log Out</button></Link>
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

      {/* User Items */}
      <div className="user-items">
        <div className="listings">
        <h3>Your Listings</h3>
        <Link to="/sell" className="back-button">
        <button>Create New Listing</button></Link>
        </div>
        <div className="profile-item-cont item-container ">
          {userItems.length > 0 ? (
            userItems.map((item) => (
              <Link
                to={`/item/${item.id}`}
                key={item.id}
                className="profile-items"
                state={{ item }} // send full item data to ItemDetail page
              >
                <img
                  className="item-img"
                  src={item.images[0] || "https://via.placeholder.com/300x200"}
                  alt={item.name}
                />
                <h3>{item.name}</h3>
                <p>{item.price}</p>
              </Link>
            ))
          ) : (
            <p>No items listed yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
