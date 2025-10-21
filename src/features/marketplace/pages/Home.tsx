import React, {useState} from "react";
import { Link } from "react-router-dom";



function Home() {

    // holds user search
    const [searchTerm, setSearchTerm] = useState("");


    // items 
    const items = [
        //fake for now , API connects here for real data 
    { id: 1, name: "Laptop", price: "$500", image: "https://via.placeholder.com/100" },
    { id: 2, name: "Headphones", price: "$40", image: "https://via.placeholder.com/100" },
    { id: 3, name: "Backpack", price: "$30", image: "https://via.placeholder.com/100" },
    { id: 4, name: "Camera", price: "$250", image: "https://via.placeholder.com/100" },
  ];


    // filter to search
    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
);


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



    </div>
  );
}

export default Home;
