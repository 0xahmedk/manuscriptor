import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../contexts/AuthContext";

function Login() {
  const [viewPassword, setViewPassword] = useState(false);
  const [state, setState] = useState({ email: "", password: "" });

  const { email, password } = state;

  const { login, currentUser } = useAuth();

  const [error, setError] = useState("");
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
    <div
      style={{
        marginTop: 50,
        marginRight: "30%",
        marginLeft: "30%",
        padding: 35,
        border: "1px solid #ccc",
        borderRadius: 20,
      }}
    >
      <div className="title">Login</div>

      {error.length > 0 && (
        <div className="notification is-danger is-light">{error}</div>
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
        <div class="control">
          <Link to={{ pathname: "/" }}>Reset Password</Link>
        </div>
      </div>

      <div class="field">
        <p class="control is-expanded">
          <button
            disabled={loading}
            onClick={handleLogin}
            class="button is-info"
          >
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
