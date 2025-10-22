import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import laptopImg from "../../../assets/laptop.jpeg";
import hatImg from "../../../assets/hat.png";

function Home() {
  // state to hold user search
  const [searchTerm, setSearchTerm] = useState("");

  // items
  const items = [
    { id: 1, name: "Laptop", price: "$500", postedBy: "Alice" },
    { id: 2, name: "Headphones", price: "$40", postedBy: "Ryan" },
    { id: 3, name: "Backpack", price: "$30", postedBy: "Sophie" },
    { id: 4, name: "Camera", price: "$250", postedBy: "Daniel" },
  ];

  // filter items based on search term
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* page head */}
      <div className="home-head">
        <div className="home-head1">
          <img id="hat-home" src={hatImg} alt="Hat logo" />
          <h1 id="page-head">Student Mart</h1>
                </div>

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

      {/* item cards */}
      <div className="items-wrapper">
        <div className="item-container">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Link
                to={`/item/${item.id}`}
                key={item.id}
                className="item-card"
              >
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
    </div>
  );
}

export default Home;
