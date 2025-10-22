
import "./styles.css";
import hatImg from "../../../assets/hat.png";

import React, { useState } from "react";

function Profile() {
  // Mock user data
  const [user, setUser] = useState({
    name: "Alice Johnson",
    email: "alice@example.com",
    bio: "Student at XYZ University. Loves selling gadgets!",
  });

  // Mock user's posted items
  const [items, setItems] = useState([
    { id: 1, name: "Laptop", price: "$500" },
    { id: 2, name: "Backpack", price: "$30" },
    { id: 3, name: "Camera", price: "$250" },
  ]);

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
          {items.length > 0 ? (
            items.map((item) => (
              <div className="item-card" key={item.id}>
                <h4>{item.name}</h4>
                <p>{item.price}</p>
              </div>
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
