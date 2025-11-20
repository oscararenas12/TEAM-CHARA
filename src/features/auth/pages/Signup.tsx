import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import hatImg from "../../../assets/hat.png";
import trustImg from "../../../assets/shield.png";
import hat2Img from "../../../assets/graduation.png";
import communityImg from "../../../assets/people.png";
import "./styles.css";

function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/";
  const isSignupPage = location.pathname === "/signup";

  return (
    <div className="signup-page">
      <img id="hat" src={hatImg} alt="Hat logo" />

      <div>
        <h1>Student Mart</h1>
        <p id="des">Buy and Sell within your college community</p>

        <div className="points-container">
          <div className="point">
            <img src={trustImg} alt="trust" />
            <p>Verified Student Only</p>
          </div>
          <div className="point">
            <img src={communityImg} alt="community" />
            <p>Trusted Community</p>
          </div>
          <div className="point">
            <img src={hat2Img} alt="hat2" />
            <p>Campus Focus</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="nav-buttons-cont">
          <div className="nav-buttons">
            <button
              className={isLoginPage ? "active" : ""}
              onClick={() => navigate("/")}
            >
              Login
            </button>
            <button
              className={isSignupPage ? "active" : ""}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form>
          <label htmlFor="name">Name</label>
          <input name="name" type="text" placeholder="Name" /> <br />
          <label htmlFor="email">Email</label>
          <input type="email" placeholder="email@student.edu" /> <br />
          <label htmlFor="Studentid">Student ID</label>
          <input name="Studentid" type="text" placeholder="Student ID" /> <br />
          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" /> <br />
          <button type="submit">Create Account</button>
        </form>
      </div>
      <p className="under-card">
        By signing up, you agree to verify your student status
      </p>
    </div>
  );
}

export default Signup;
