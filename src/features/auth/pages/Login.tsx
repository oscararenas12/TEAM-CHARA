// Can't bypass login page with no inputs now
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginCredentials, User, ApiResponse } from "../../../types";
import hatImg from "../../../assets/hat.png";
import trustImg from "../../../assets/shield.png";
import hat2Img from "../../../assets/graduation.png";
import communityImg from "../../../assets/people.png";
import "./styles.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // State with proper typing
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check active page based on pathname
  const isLoginPage = location.pathname === "/";
  const isSignupPage = location.pathname === "/signup";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // const response: ApiResponse<User> = await loginUser(credentials);
      // if (response.success && response.data) {
      //   // Store user in context/state management
      //   navigate("/home");
      // } else {
      //   setError(response.error || "Login failed");
      // }

      // Temporary navigation for now
      navigate("/home");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
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

        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            placeholder="email@student.csulb.edu"
            value={credentials.email}
            onChange={handleInputChange}
            required
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
            required
          />{" "}
          <br />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <p className="under-card">
        By signing up, you agree to verify your student status
      </p>
    </div>
  );
}

export default Login;
