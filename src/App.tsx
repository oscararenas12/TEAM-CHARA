import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./features/auth/pages/Login";
import Signup from "./features/auth/pages/Signup";
import Home from "./features/marketplace/pages/Home";
import Messages from "./features/messaging/pages/Messages";
import Sell from "./features/marketplace/pages/Sell";
import Profile from "./features/profile/pages/Profile";
import Navbar from "./components/shared/Navbar";
import ItemDetail from "./features/marketplace/pages/ItemDetail";
import EditProfile from "./features/profile/pages/EditProfile";
import PublicProfile from "./features/profile/pages/PublicProfile";

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
        <Route path="/home" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/publicprofile/:postedBy" element={<PublicProfile />} />

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
