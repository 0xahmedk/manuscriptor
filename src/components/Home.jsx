import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function Home() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();

  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const page_type = urlParams.get("page_type");

  console.log(page_type);

  return (
    <div className="container">
      {error.length > 0 && (
        <div className="notification is-danger is-light">{error}</div>
      )}
      {currentUser && (
        <section className="hero is-fullheight has-text-centered">
          <div className="hero-body">
            {currentUser ? (
              <div className="">
                <p className="title">
                  You are all set now with your account you can start submission
                  now by clicking button below
                </p>
                <Link to={{ pathname: "/submit" }}>
                  <button className="button is-info">Start Submission</button>
                </Link>
              </div>
            ) : (
              <div className="">
                <p className="title">
                  Looks Like you are not Logged into an account!
                </p>
                <p className="title">First Login</p>
              </div>
            )}
          </div>
        </section>
      )}
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
