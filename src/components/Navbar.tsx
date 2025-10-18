import React from "react";
import { NavLink } from "react-router-dom";
import "../styles.css";

function Navbar() {
  return (
    <nav className="bottom-navbar">
      <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
         Home 
      </NavLink>
      <NavLink to="/messages" className={({ isActive }) => (isActive ? "active" : "")}>
         Messages 
      </NavLink>
      <NavLink to="/sell" className={({ isActive }) => (isActive ? "active" : "")}>
         Sell 
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
         Profile 
      </NavLink>
    </nav>
  );
}

export default Navbar;