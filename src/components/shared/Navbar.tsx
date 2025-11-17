"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import homeImg from "@/assets/home.png";
import messageImg from "@/assets/message.png";
import userImg from "@/assets/user.png";
import plusImg from "@/assets/plus.png";

export default function Navbar() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navItems = [
    { href: "/home", icon: homeImg.src, label: "Home", subtext: "Find what you need, Sell what you don't" },
    { href: "/messages", icon: messageImg.src, label: "Messages", subtext: "Connect with buyers and sellers." },
    { href: "/sell", icon: plusImg.src, label: "Sell", subtext: "List your items for sale" },
    { href: "/profile", icon: userImg.src, label: "Profile", subtext: "Manage your account and listings" },
  ];

  return (
    <nav className="dock-navbar">
      <div className="dock-container">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          const distance =
            hoveredIndex !== null ? Math.abs(index - hoveredIndex) : null;
          const scale =
            distance !== null ? Math.max(1, 1.5 - distance * 0.3) : 1;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dock-item ${isActive ? "active" : ""}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                transform: `scale(${scale}) translateY(${
                  distance !== null ? -10 * (1.5 - distance * 0.3) : 0
                }px)`,
              }}
            >
              <img className="dock-icon" src={item.icon} alt={item.label} />
              <span className="dock-label">{item.label}</span>
              {hoveredIndex === index && (
                <span className="dock-tooltip">{item.subtext}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
