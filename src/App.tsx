import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import Sell from "./pages/Sell";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();

  // Don't show navbar on login/signup
  const hideNavbar = location.pathname === "/" || location.pathname === "/signup";

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {!hideNavbar && <Navbar />}
    </div>
  );
}
// No AppWrapper needed if you wrap App in Router in index.tsx
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
