import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import hatImg from "../../../assets/hat.png";
import trustImg from "../../../assets/shield.png";
import hat2Img from "../../../assets/graduation.png";
import communityImg from "../../../assets/people.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check active page based on pathname
  const isLoginPage = location.pathname === "/";
  const isSignupPage = location.pathname === "/signup"; // ✅ Fixed lowercase

  const handleLogin = (e: React.FormEvent) => {
  e.preventDefault(); // Prevent page reload
    // You can add login validation here later
  navigate("/home"); // Navigate to Home page
  };

  return (
    <div className="login-page">
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

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input name="email" type="email" placeholder="email@student.edu" /><br />

          <label htmlFor="password">Password</label>
          <input type="password" placeholder="Password" /> <br />

          <button type="submit">Login</button>
        </form>
      </div>
      <p className="under-card">By signing up, you agree to verify your student status</p>
    </div>
  );
}

export default Login;
