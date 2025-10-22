import React, { useState } from "react";
import { Link } from "react-router-dom";
<<<<<<< Updated upstream
import "./styles.css";
=======
import laptopImg from "../../../assets/laptop.jpeg"

>>>>>>> Stashed changes

function Home() {
  // holds user search
  const [searchTerm, setSearchTerm] = useState("");

<<<<<<< Updated upstream
  // items
  const items = [
    //fake for now , API connects here for real data
    {
      id: 1,
      name: "Laptop",
      price: "$500",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Headphones",
      price: "$40",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Backpack",
      price: "$30",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 4,
      name: "Camera",
      price: "$250",
      image: "https://via.placeholder.com/100",
    },
  ];

  // filter to search
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
      {/* page head  */}
      <div className="home-head">
        <h1 id="page-head">Student Mart</h1>
        <p>Find what you need, Sell what you don't</p>
      </div>

      {/* Search bar */}

      <input
        type="text"
        placeholder="Search..."
        className="Search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // updates search term
      />

      {/* item cards */}
<<<<<<< Updated upstream
=======
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
    </div>
  );
}

export default Home;
