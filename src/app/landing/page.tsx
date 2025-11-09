'use client'

import React from 'react'
import Link from 'next/link'
import "./styles.css"
import trustImg from "@/assets/shield.png"
import message2Img from "@/assets/message2.png"
import cameraImg from "@/assets/camera.png"
import peepImg from "@/assets/peep.png"
import search2Img from "@/assets/search2.png"
import verified2Img from "@/assets/verified2.png"
import growthImg from "@/assets/growth.png"
import checkImg from "@/assets/check.png"

export default function LandingPage() {
  return (
    <div className="landing-page">

      {/* ===== HERO SECTION ===== */}
      <section id="home" className="hero-section">
        <div className="landing-center">
          <button className="landing-butt">CSULB Student Marketplace</button>
        </div>

        <p className="words">
          Buy and sell with <br /> Fellow Students
        </p>
        <p className="hero-paragraph">
          A trusted marketplace built exclusively for CSULB students. Find textbooks, furniture, and dorm <br /> essentials from verified students on campus.
        </p>

        <div className="landing-butt2">
          <Link href="/login">
            <button className="landing-butt">Get Started &gt;</button>
          </Link>
          <Link href="/login">
            <button id="sign-in">Sign in</button>
          </Link>
        </div>

        <p className="hero-paragraph verified-text">
          <img src={trustImg.src} alt="Trust Image" id="verified" />
          Verified students only • safe & trusted
        </p>

        <div className="landing-bottoms">
          <div className="landing-bottom">
            <p className="val">1000+</p>
            <p className="hero-paragraph">Verified Students</p>
          </div>
          <div className="landing-bottom">
            <p className="val">5000+</p>
            <p className="hero-paragraph">Items listed</p>
          </div>
          <div className="landing-bottom">
            <p className="val">98%</p>
            <p className="hero-paragraph">Satisfaction Rate</p>
          </div>
          <div className="landing-bottom">
            <p className="val">$50k+</p>
            <p className="hero-paragraph">Student Savings</p>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="section">
        <h2>Everything You Need to Buy & Sell</h2>
        <p className="hero-paragraph">
          Built specifically for college students with features that make buying and selling safe, easy, and convenient.
        </p>

        <div className="features">
          <div className="feature">
            <div className="feat-head"><img src={verified2Img.src} alt="Verified Students" /></div>
            <h3 className="feature-title">Verified Students Only</h3>
            <p className="feature-text">Every user is verified with a .edu email and student ID. Know you're dealing with real students from your campus.</p>
          </div>
          <div className="feature">
            <div className="feat-head"><img src={search2Img.src} alt="Search" /></div>
            <h3 className="feature-title">Smart Search & Filters</h3>
            <p className="feature-text">Find exactly what you need with powerful search and category filters. Browse textbooks, furniture, electronics, and more.</p>
          </div>
          <div className="feature">
            <div className="feat-head"><img src={message2Img.src} alt="Messaging" /></div>
            <h3 className="feature-title">Private Messaging</h3>
            <p className="feature-text">Chat directly with buyers and sellers with real-time messaging. Quick replies and read receipts keep conversations moving.</p>
          </div>
          <div className="feature">
            <div className="feat-head"><img src={cameraImg.src} alt="Photos" /></div>
            <h3 className="feature-title">Photo-First Listings</h3>
            <p className="feature-text">Post items with multiple photos and condition ratings. Show buyers exactly what they're getting.</p>
          </div>
          <div className="feature">
            <div className="feat-head"><img src={growthImg.src} alt="Growth" /></div>
            <h3 className="feature-title">Trust Scores</h3>
            <p className="feature-text">Build your reputation with trust scores based on successful transactions. See ratings before you buy or sell.</p>
          </div>
          <div className="feature">
            <div className="feat-head"><img src={peepImg.src} alt="Community" /></div>
            <h3 className="feature-title">Campus Community</h3>
            <p className="feature-text">Connect with fellow CSULB students. Arrange meetups on campus for safe, convenient exchanges.</p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="section">
        <h2>How It Works</h2>
        <p className="hero-paragraph">
          Get started in minutes and join the CSULB student marketplace.
        </p>

        <div className="hows">
          <div className="how">
            <div className="circle"><p>1</p></div>
            <p className="how1">Sign Up & Verify</p>
            <p className="hero-paragraph how2">Create your account using your CSULB .edu email address and verify your student status with your student ID.</p>
          </div>

          <div className="how">
            <div className="circle"><p>2</p></div>
            <p className="how1">Browse or List Items</p>
            <p className="hero-paragraph how2">Search for items you need or post your own listings with photos, description, and pricing.</p>
          </div>

          <div className="how">
            <div className="circle"><p>3</p></div>
            <p className="how1">Connect & Trade</p>
            <p className="hero-paragraph how2">Message interested buyers or sellers, arrange meetups on campus, and complete your transaction safely.</p>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY SECTION ===== */}
      <section id="category" className="section">
        <h2>Popular Categories</h2>
        <p>Find everything you need for college life</p>

        <div className="cat-boxes">
          <div className="cat-box"><p>Textbooks</p></div>
          <div className="cat-box"><p>Furniture</p></div>
          <div className="cat-box"><p>Electronics</p></div>
          <div className="cat-box"><p>Clothing</p></div>
          <div className="cat-box"><p>Kitchen Items</p></div>
          <div className="cat-box"><p>Sports Equipment</p></div>
          <div className="cat-box"><p>School Supplies</p></div>
          <div className="cat-box"><p>Decor</p></div>
        </div>
      </section>

      {/* ===== SAFETY SECTION ===== */}
      <section id="safety" className="section">
        <div><img id="v2" src={verified2Img.src} alt="Verified" /></div>
        <h2>Your Safety is Our Priority</h2>
        <p className="hero-paragraph">
          We've built multiple layers of protection to ensure a safe marketplace experience.
        </p>

        <div className="bullets">
          <div>
            <div className="s1">
              <img className="check" src={checkImg.src} alt="Check" />
              <p>Student Verification Required</p>
            </div>
            <p className="hero-paragraph s2">All users must verify their student status with a .edu email and student ID.</p>
          </div>
          <div>
            <div className="s1">
              <img className="check" src={checkImg.src} alt="Check" />
              <p>Trust Score System</p>
            </div>
            <p className="hero-paragraph s2">See user ratings before making a deal.</p>
          </div>
          <div>
            <div className="s1">
              <img className="check" src={checkImg.src} alt="Check" />
              <p>Campus Meetups</p>
            </div>
            <p className="hero-paragraph s2">Meet in safe, public locations on campus for all transactions.</p>
          </div>
          <div>
            <div className="s1">
              <img className="check" src={checkImg.src} alt="Check" />
              <p>Secure Messaging</p>
            </div>
            <p className="hero-paragraph s2">All communications happen through our secure in-app messaging system.</p>
          </div>
        </div>
      </section>

      {/* ===== FINAL SECTION ===== */}
      <section id="last" className="section">
        <h2 id="last-h2">Ready to Get Started?</h2>
        <p className="hero-paragraph">
          Join hundreds of CSULB students already buying and selling on campus.
        </p>
        <Link href="/login">
          <button className="landing-butt last-butt">Create Your Account</button>
        </Link>
        <p className="hero-paragraph">No Fee • No hidden costs • Just students helping students.</p>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p className="foot">
          © {new Date().getFullYear()} Student Marketplace. For verified CSULB students only. <br />
          Built with ♥️ for the Beach community.
        </p>
      </footer>
    </div>
  )
}
