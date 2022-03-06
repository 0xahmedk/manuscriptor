import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../components/Login";
import Register from "../components/Register";

function WelcomePage() {
  return (
    <div style={{ marginBottom: 20 }}>
      <div class="columns">
        <div class="column is-half">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
        <div class="column is-half">
          {" "}
          <div style={{ marginTop: 70, marginRight: 60 }}>
            <h1 class="title">Welcome to the submission site for</h1>
            <p
              class="subtitle"
              style={{ textTransform: "capitalize", marginTop: 15 }}
            >
              Emerald Emerging Markets Case Studies
            </p>
            <p>
              To begin, log in with your user ID and password. If you are unsure
              about whether or not you have an account, or have forgotten your
              password, go to the Reset Password screen.
            </p>
            <p class="subtitle" style={{ marginTop: 15 }}>
              Need help? <a href="/">click here</a>
            </p>
            <div>
              With immediate effect all registered users require a validated
              ORCID associated with their account.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
