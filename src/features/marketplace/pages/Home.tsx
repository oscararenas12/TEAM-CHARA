import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import laptopImg from "../../../assets/laptop.jpeg";
import hatImg from "../../../assets/hat.png";
import cartImg from "../../../assets/cart.png";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  // mock items with image arrays (for detail page)
  const items = [
    {
      id: 1,
      name: "Laptop",
      price: "$500",
      postedBy: "Alice Johnson",
      images: [
        laptopImg,
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
      condition: "used-like-new",
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
    },
  ];

  // filter based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* page header */}
        <div className="home-head1">
          <div className="home-head2">
          <img id="hat-home" src={hatImg} alt="Hat logo" />
          <h1 id="page-head">Student Mart</h1></div>
          <div className="icon-cart">

          <Link to="/messages" className="cart">
      <img className="cart-icon"  src={cartImg} alt="cart" />
      </Link></div>
        </div>



      <p id="line">Find what you need, Sell what you don't</p>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        className="Search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Item cards */}
      <div className="items-wrapper">
        <div className="item-container">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Link
                to={`/item/${item.id}`}
                key={item.id}
                className="item-card"
                state={{ item }} // 👈 send full item data to detail page
              >
                <img
                  className="item-img"
                  src={item.images[0] || laptopImg}
                  alt={item.name}
                />
                <h3>{item.name}</h3>
                <p>{item.price}</p>
                <p className="posted-by">Posted by: {item.postedBy}</p>
              </Link>
            ))
          ) : (
            <p className="no-items">No items found 😕</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
