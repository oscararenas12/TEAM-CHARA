import React, { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./styles.css";

function App() {
  const [page, setPage] = useState<"login" | "signup">("login");

  return (
    <div>
      {page === "login" ? (
        <Login setPage={setPage} currentPage={page} />
      ) : (
        <Signup setPage={setPage} currentPage={page} />
      )}
    </div>
  );
}

export default App;