import React, { useState } from "react";
import { Link } from "react-router-dom";
<<<<<<< Updated upstream
import "./styles.css";
import laptopImg from "../../../assets/laptop.jpeg";
import hatImg from "../../../assets/hat.png";
import cartImg from "../../../assets/cart.png";
=======
import laptopImg from "../../../assets/laptop.jpeg"

>>>>>>> Stashed changes

function Home() {
  const [searchTerm, setSearchTerm] = useState("");

<<<<<<< Updated upstream
  // mock items with image arrays (for detail page)
  const items = [
    {
      id: 1,
      name: "Laptop",
      price: "$500",
      postedBy: "Alice",
      images: [
        laptopImg,
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
  ];

  // filter based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
=======
    // holds user search
    const [searchTerm, setSearchTerm] = useState("");


    // items 
    const items = [
      { id: 1, name: "Laptop", price: "$500", image: "https://via.placeholder.com/100", postedBy: "Alice" },
      { id: 2, name: "Headphones", price: "$40", image: "https://via.placeholder.com/100", postedBy: "Ryan" },
      { id: 3, name: "Backpack", price: "$30", image: "https://via.placeholder.com/100", postedBy: "Sophie" },
      { id: 4, name: "Camera", price: "$250", image: "https://via.placeholder.com/100", postedBy: "Daniel" },
    ];


    // filter to search
  const filteredItems =
    searchTerm.trim() === ""
      ? items
      : items.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
      

      {/* item cards */}
      <div className="items-wrapper">
        <div className="item-container">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Link to={`/item/${item.id}`} key={item.id} className="item-card">
                <img className="item-img" src={laptopImg} alt={item.name} />
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
>>>>>>> Stashed changes

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
