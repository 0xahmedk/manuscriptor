import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../contexts/FirebaseContext";
import SideLogo from "./SideLogo";

function Login() {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  console.log("url Params Login: ", urlParams.get("codee"));

  const [orcidAuthCode, setOrcidAuthCode] = useState(
    urlParams.get("code") || null
  );

  useEffect(() => {
    if (orcidAuthCode) {
      console.log(
        "API Call: ",
        `client_id=APP-0PPPQUENE57U0IJI&client_secret=793536c5-e809-406e-b0e6-a8140a389d73&grant_type=authorization_code&redirect_uri=https://localhost:3000&code=${orcidAuthCode}`
      );
      fetch("https://orcid.org/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `client_id=APP-0PPPQUENE57U0IJI&client_secret=793536c5-e809-406e-b0e6-a8140a389d73&grant_type=authorization_code&redirect_uri=https://ahmedk743.github.io/manuscriptor/#/login&code=${orcidAuthCode}`,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => console.log(error));
    }
  }, []);

  const [viewPassword, setViewPassword] = useState(false);
  const [state, setState] = useState({ email: "", password: "" });

  const { email, password } = state;

  const { login, currentUser, forgotPassword } = useAuth();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();

    if (password.length < 6) {
      return setError("Passwords must be 6 characters long!");
    }

    setError("");
    setLoading(true);

    try {
      await login(email, password).then(() => {
        navigate("/");
      });
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
          setError("User not found!");
          break;
        case "auth/wrong-password":
          setError("Provided password is wrong");
          break;
        default:
      }
    }

    setLoading(false);
  }

  const onInputChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div className="columns">
      <div className="column is-half">
        <div
          style={{
            marginTop: 50,
            marginRight: "5%",
            marginLeft: "5%",
            padding: 35,
            border: "1px solid #ccc",
            borderRadius: 20,
          }}
        >
          <div className="title">Login</div>

          {error.length > 0 && (
            <div className="notification is-danger is-light">{error}</div>
          )}

          {success.length > 0 && (
            <div class="notification is-success is-light">
              <button onClick={() => setSuccess(false)} class="delete"></button>
              {success}
            </div>
          )}

          <div className="field">
            <label class="label">
              Email <span style={{ color: "red" }}>*</span>{" "}
            </label>
            <p className="control has-icons-left">
              <input
                required
                className="input"
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
            </p>
          </div>
          <div className="field">
            <label class="label">
              Password <span style={{ color: "red" }}>*</span>
            </label>
            <p className="control has-icons-left has-icons-right">
              <input
                required
                className="input"
                type={viewPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={password}
                onChange={onInputChange}
              />
              <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <i
                style={{
                  position: "absolute",
                  top: 7,
                  right: 10,
                  color: viewPassword ? "black" : "#7774",
                }}
                onClick={() => setViewPassword(!viewPassword)}
              >
                <FontAwesomeIcon icon={faEye} />
              </i>
            </p>
          </div>

          <div class="field ">
            <button
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                window.location.href =
                  "https://orcid.org/oauth/authorize?client_id=APP-0PPPQUENE57U0IJI&response_type=code&scope=/authenticate&redirect_uri=https://ahmedk743.github.io/manuscriptor/#/login";
              }}
              rel="noopener noreferrer"
            >
              <img
                style={{ width: 24, height: 24, marginRight: 5 }}
                src={require("../assets/ORCID.png")}
                alt="orcid"
                srcset=""
              />
              Login with ORCID
            </button>
          </div>

          <div class="field ">
            <div class="control">
              <a
                onClick={() => {
                  if (email !== "") {
                    forgotPassword(email);
                    setState({ ...state, email: "" });
                    setError("");
                    setSuccess(
                      "A reset link has been sent to your email, follow along that link"
                    );
                  } else {
                    setSuccess("");
                    setError("Please enter email first!");
                  }
                }}
                to={{ pathname: "/" }}
                style={{ textDecorationLine: "underline" }}
              >
                Reset Password
              </a>
            </div>
          </div>
          <div class="field" style={{ marginTop: 10 }}>
            <p class="control">
              <span className="block" style={{ alignSelf: "flex-end" }}>
                Don't have an account?{" "}
                <Link to={{ pathname: "/register" }} href="#">
                  Register!
                </Link>
              </span>
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <button
              disabled={loading}
              onClick={handleLogin}
              class="button is-info"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <div className="column is-half">
        <SideLogo />
      </div>
    </div>
  );
}

export default Login;
