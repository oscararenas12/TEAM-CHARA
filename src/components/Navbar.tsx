import React from "react";
import { NavLink } from "react-router-dom";
import homeImg from "../assets/home.png";
import messageImg from "../assets/message.png";
import userImg from "../assets/user.png";
import plusImg from "../assets/plus.png";
import "../styles.css";

function Navbar() {
  return (
    <nav className="bottom-navbar">
      <div className="nav-col">
      <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
      <img className="Nav-icon"  src={homeImg} alt="home" />
         <span className="bar-text">Home</span>
      </NavLink>
      </div>
      <div className="nav-col">
      <NavLink to="/messages" className={({ isActive }) => (isActive ? "active" : "")}>
      <img className="Nav-icon"  src={messageImg} alt="message" />
         <span className="bar-text">Messages </span>
      </NavLink>
    </div>
    <div className="nav-col">
      <NavLink to="/sell" className={({ isActive }) => (isActive ? "active" : "")}>
      <img className="Nav-icon" src={plusImg} alt="sell" />
         <span className="bar-text">Sell</span>
      </NavLink>
      </div>
      <div className="nav-col">
      <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
      <img className="Nav-icon"  src={userImg} alt="user" />
         <span className="bar-text">Profile </span>
      </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;