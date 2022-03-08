import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Login from "./Login";

import { useAuth } from "../contexts/AuthContext";

function Home() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();

  let navigate = useNavigate();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <div className="container">
      {error.length > 0 && (
        <div className="notification is-danger is-light">{error}</div>
      )}
      {currentUser && <div>Email: {currentUser.email}</div>}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;

{
  /*
<div style={{ marginTop: 70, marginRight: 60 }}>
        <h1 className="title">Welcome to the submission site for</h1>
        <p
          className="subtitle"
          style={{ textTransform: "capitalize", marginTop: 15 }}
        >
          Emerald Emerging Markets Case Studies
        </p>
        <p>
          To begin, log in with your user ID and password. If you are unsure
          about whether or not you have an account, or have forgotten your
          password, go to the Reset Password screen.
        </p>
        <p className="subtitle" style={{ marginTop: 15 }}>
          Need help? <a href="/">click here</a>
        </p>
        <div>
          With immediate effect all registered users require a validated ORCID
          associated with their account.
        </div>
      </div>
*/
}
