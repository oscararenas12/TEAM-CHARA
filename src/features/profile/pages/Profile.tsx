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
    bio: "Student at XYZ University. Loves selling gadgets!",
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
      <div className="profile-header">
        <img
          className="profile-pic"
          alt={`${user.name} profile`}
        />
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p className="bio">{user.bio}</p>
          <button>Edit</button>
        </div>
      </div>

      {/* User Items */}
      <h3>Your Listings</h3>
      <div className="user-items">
        <div className="item-container">
          {userItems.length > 0 ? (
            userItems.map((item) => (
              <Link
                to={`/item/${item.id}`}
                key={item.id}
                className="item-card"
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
