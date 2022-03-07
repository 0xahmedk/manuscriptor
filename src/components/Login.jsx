import React, { useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { getAuth, signInWithEmailAndPassword } from "../firebase";

function Login() {
  const [viewPassword, setViewPassword] = useState(false);
  const [state, setState] = useState({ email: "", password: "" });

  const { email, password } = state;

  const handleLogin = async () => {
    await signInWithEmailAndPassword(getAuth(), email, password)
      .then((cred) => {
        console.log(cred.user);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const onInputChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <div
      style={{
        marginTop: 50,
        marginRight: 50,
        marginLeft: 50,
        padding: 35,
        border: "1px solid #ccc",
        borderRadius: 20,
      }}
    >
      <div className="title">Login</div>
      <div className="field">
        <label class="label">
          Email <span style={{ color: "red" }}>*</span>{" "}
        </label>
        <p className="control has-icons-left">
          <input
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
        <div class="control">
          <label class="checkbox ">
            <input type="checkbox" style={{ marginRight: 5 }} />
            Remember me
          </label>
        </div>
      </div>

      <div class="field">
        <p class="control is-expanded">
          <button onClick={() => handleLogin()} class="button is-info">
            Login
          </button>
        </p>
      </div>

      <div class="field" style={{ marginTop: 50 }}>
        <p class="control">
          <span className="block" style={{ alignSelf: "flex-end" }}>
            Don't have an account?{" "}
            <Link to={{ pathname: "/register" }} href="#">
              Register!
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
