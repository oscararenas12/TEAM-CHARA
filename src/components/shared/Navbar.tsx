'use client'

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import homeImg from "@/assets/home.png"
import messageImg from "@/assets/message.png"
import userImg from "@/assets/user.png"
import plusImg from "@/assets/plus.png"

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bottom-navbar">
      <div className="nav-col">
        <Link
          href="/home"
          className={pathname === "/home" ? "active" : ""}
        >
          <img className="Nav-icon" src={homeImg.src} alt="home" />
          <span className="bar-text">Home</span>
        </Link>
      </div>
      <div className="nav-col">
        <Link
          href="/messages"
          className={pathname === "/messages" ? "active" : ""}
        >
          <img className="Nav-icon" src={messageImg.src} alt="message" />
          <span className="bar-text">Messages </span>
        </Link>
      </div>
      <div className="nav-col">
        <Link
          href="/sell"
          className={pathname === "/sell" ? "active" : ""}
        >
          <img className="Nav-icon" src={plusImg.src} alt="sell" />
          <span className="bar-text">Sell</span>
        </Link>
      </div>
      <div className="nav-col">
        <Link
          href="/profile"
          className={pathname === "/profile" ? "active" : ""}
        >
          <img className="Nav-icon" src={userImg.src} alt="user" />
          <span className="bar-text">Profile </span>
        </Link>
      </div>
    </nav>
  )
}
