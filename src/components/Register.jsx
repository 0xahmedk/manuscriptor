import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  fa1,
  fa2,
  fa3,
} from "@fortawesome/free-solid-svg-icons";

import { countries } from "../modules/countries";
import { universities } from "../modules/universities";
import { useAuth } from "../contexts/AuthContext";

function Register() {
  const [viewPassword, setViewPassword] = useState(false);
  const [step, setStep] = useState(3);

  const [state, setState] = useState({
    email: "",
    password: "",
    cpassword: "",
  });

  const { email, password, cpassword } = state;

  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setSuccess(false);

    if (password !== cpassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Passwords must be 6 characters long!");
    }

    setError("");
    setLoading(true);

    try {
      await signup(email, password).then(() => {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      });
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email already in use !");
          break;
        case "auth/invalid-password":
          setError("Password Incorrect! It must be 6 character long minimum");
          break;
        case "auth/invalid-email":
          setError(
            "The provided value for the email user property is invalid!"
          );
          break;
        default:
          setError("Cannot create account!");
      }
    }

    setLoading(false);
  }

  const onInputChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const renderStepperButton = (title, color, icon, stp) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
      }}
    >
      <button
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          textAlign: "center",
          backgroundColor: stp == step ? color : "#777",
          marginBottom: 5,
        }}
        onClick={() => setStep(stp)}
      >
        <FontAwesomeIcon icon={icon} color="#fff" />
      </button>
      <span style={{ width: 90, textAlign: "center" }}>{title}</span>
    </div>
  );

  const renderFormBody = (step) => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="field">
              <div className="select">
                <select>
                  <option>Select Prefix</option>
                  <option>Mr.</option>
                  <option>Ms.</option>
                  <option>Dr.</option>
                  <option>Prof.</option>
                </select>
              </div>
              {"  "}
              <span style={{ color: "red" }}>*</span>
            </div>
            <div className="columns">
              <div className="column is-half">
                <div className="field">
                  <label className="label">
                    First Name <span style={{ color: "red" }}>*</span>{" "}
                  </label>
                  <p className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder="First Name"
                    />
                  </p>
                </div>
              </div>
              <div className="column">
                <div className="field">
                  <label className="label">
                    Last Name <span style={{ color: "red" }}>*</span>{" "}
                  </label>
                  <p className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder="Last Name"
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Degree</label>
              <p className="control">
                <input className="input" type="text" placeholder="Degree" />
              </p>
            </div>

            <div className="field">
              <label className="label">
                Email <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input className="input" type="email" placeholder="Email" />
              </p>
            </div>

            <div className="field">
              <p className="control is-expanded">
                <button className="button is-info">Next</button>
              </p>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="field">
              <label className="label">
                Street # <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="Street No"
                />
              </p>
            </div>
            <div className="field">
              <label className="label">
                ZipCode <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input className="input" type="number" placeholder="Zip Code" />
              </p>
            </div>
            <div className="field">
              <label className="label">
                City <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input className="input" type="text" placeholder="City" />
              </p>
            </div>

            <div className="field">
              <label className="label">
                Country <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <div class="select">
                <select>
                  <option>Select Country</option>
                  {countries.map((c) => (
                    <option>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="field">
              <label className="label">
                Email <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={onInputChange}
                  required
                />
              </p>
            </div>
            <div className="field">
              <label className="label">
                Password <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input
                  className="input"
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={onInputChange}
                  value={password}
                  required
                />
              </p>
            </div>
            <div className="field">
              <label className="label">
                Confirm Password <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input
                  className="input"
                  type="password"
                  placeholder="Confirm Password"
                  name="cpassword"
                  value={cpassword}
                  onChange={onInputChange}
                  required
                />
              </p>
            </div>
          </>
        );
    }
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
      <div className="title">Register</div>

      {/* Stepper*/}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          position: "relative",
          marginTop: 5,
          marginBottom: 30,
        }}
      >
        {renderStepperButton("Name", "hsl(204, 86%, 53%)", fa1, 1)}
        {renderStepperButton("Address", "hsl(204, 86%, 53%)", fa2, 2)}
        {renderStepperButton("ID/Password", "hsl(204, 86%, 53%)", fa3, 3)}
        <div
          style={{
            width: "65%",
            height: 4,
            backgroundColor: "#000",
            position: "absolute",
            top: "25%",
            zIndex: 0,
          }}
        />
      </div>
      {error.length > 0 && (
        <div className="notification is-danger is-light">{error}</div>
      )}
      {success && (
        <div class="notification is-success is-light">
          <button onClick={() => setSuccess(false)} class="delete"></button>
          Account has been successfully created!
        </div>
      )}

      <form>
        {renderFormBody(step)}
        <div className="field">
          <p className="control is-expanded">
            <button
              onClick={() => {
                console.log(universities);
              }}
              disabled={loading}
              className="button is-info"
            >
              {step == 3 ? "Register" : "Next"}
            </button>
          </p>
        </div>
      </form>

      <div className="field" style={{ marginTop: 50 }}>
        <p className="control">
          <span className="block" style={{ alignSelf: "flex-end" }}>
            Already have an account?{" "}
            <Link to={{ pathname: "/login" }}>Login </Link>
          </span>
          instead.
        </p>
      </div>
    </div>
  );
}

export default Register;
