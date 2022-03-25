import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../contexts/FirebaseContext";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

function Header() {
  const [userData, setUserData] = useState([]);
  const { currentUser, logout } = useAuth();

  let navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch {
      alert("Failed to log out");
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      console.log("userDataHeaderasdasdasdasdsad: ", currentUser?.uid);
      const userRef = doc(db, "users", currentUser?.uid);
      const docSnap = await getDoc(userRef);
      setUserData(docSnap.data());
    };

    fetchUser();
  }, []);

  return (
    <nav
      className="navbar has-shadow py-3 is-info"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a style={{ marginLeft: 15 }} className="navbar-item" href="/">
          <strong style={{ fontWeight: "700", fontSize: 24 }}>
            IIUI MANUSCRIPT MANAGEMENT SYSTEM
          </strong>
        </a>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        {currentUser && (
          <div className="navbar-start">
            <Link to={{ pathname: "/" }} className="navbar-item">
              Home
            </Link>

            <Link to={{ pathname: "/submissions" }} className="navbar-item">
              Submissions
            </Link>
          </div>
        )}

        <div className="navbar-end">
          <div className="navbar-item">
            {currentUser ? (
              <>
                <div className="navbar-item has-dropdown is-hoverable">
                  <a
                    className="navbar-link"
                    style={{
                      color: "white",
                      marginRight: 35,
                      textTransform: "capitalize",
                      fontWeight: "bold",
                    }}
                  >
                    {userData.length !== 0 && userData?.forms[0].data.firstName}
                  </a>

                  <div className="navbar-dropdown">
                    <span className="navbar-item">{currentUser?.email}</span>
                    <hr className="navbar-divider" />
                    <div className="navbar-item">
                      <FontAwesomeIcon
                        style={{ marginRight: 5 }}
                        icon={faUser}
                      />
                      <Link
                        to={{ pathname: "/updateprofile" }}
                        state={userData.forms}
                      >
                        Update Profile
                      </Link>
                    </div>
                  </div>
                </div>
                <button
                  className="button is-info is-light is-small"
                  onClick={handleLogout}
                >
                  <strong>Log Out</strong>
                </button>
              </>
            ) : (
              <div className="buttons">
                <Link
                  to={{ pathname: "/register" }}
                  className="button is-info is-light"
                >
                  <strong>Register</strong>
                </Link>
                <Link
                  to={{ pathname: "/login" }}
                  className="button is-info is-light"
                >
                  <strong>Log in</strong>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;

/*
<header style={{ display: "flex", flexDirection: "row" }}>
      <h1 style={{ fontWeight: "700", marginLeft: 20 }}>MANUSCRIPTOR</h1>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <div style={{ color: "#fff" }}>Account</div>
        <div style={{ marginLeft: 10 }}>
          {currentUser && <button>Log Out</button>}
        </div>
        <div style={{ marginLeft: 10 }}>
          <figure className="image is-32x32">
            <img
              className="is-rounded"
              src="https://bulma.io/images/placeholders/32x32.png"
            />
          </figure>
        </div>
      </div>
    </header> */
