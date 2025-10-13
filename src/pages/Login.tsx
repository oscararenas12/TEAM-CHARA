import React from "react";
import hatImg from "../assets/hat.png";
import trustImg from "../assets/shield.png";
import hat2Img from "../assets/graduation.png";
import communityImg from "../assets/people.png";

type Props = {
  setPage: (page: "login" | "signup") => void;
  currentPage: "login" | "signup";
};

function Login({ setPage, currentPage }: Props) {
  return (
    <div className="login-page">
        <img id="hat" src={hatImg} alt="Hat logo"></img>
        
        <div>
            <h1>Student Mart</h1>
            <p id="des">Buy and Sell within your college community</p>
           
                <div className="points-container">
                    <div className="point">
                        <img src={trustImg} alt="trust"></img>           
                        <p>Verified Student Only</p>
                    </div>
                    <div className="point">
                        <img src={communityImg} alt="community"></img>
                        <p>Trusted Community</p>
                    </div>
                    <div className="point">
                        <img src={hat2Img} alt="hat2"></img>
    
                        <p>Campus Focus</p>
                    </div>
                </div>
            

        </div>


      <div className="card">

        <div className="nav-buttons-cont">
          <div className="nav-buttons">
           
            <button
              className={currentPage === "login" ? "active" : ""}
              onClick={() => setPage("login")}
            >
              Login
            </button>
            <button
              className={currentPage === "signup" ? "active" : ""}
              onClick={() => setPage("signup")}
            >
              Sign Up
            </button>
          </div>
        </div>

        <form>
          <label htmlFor="email" >Email</label>
          <input name="email" type="email" placeholder="email@student.edu" /><br />
          <label htmlFor="password" >Password</label>
          <input type="password" placeholder="Password" /> <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;