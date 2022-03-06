import React, { useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  fa1,
  fa2,
  fa3,
} from "@fortawesome/free-solid-svg-icons";

function Register() {
  const [viewPassword, setViewPassword] = useState(false);

  const renderStepperButton = (title, color, icon) => (
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
          backgroundColor: color,
          marginBottom: 5,
        }}
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
              <div class="select">
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
                  <label class="label">
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
                  <label class="label">
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
              <label class="label">Degree</label>
              <p className="control">
                <input className="input" type="text" placeholder="Degree" />
              </p>
            </div>

            <div className="field">
              <label class="label">
                Email <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input className="input" type="email" placeholder="Email" />
              </p>
            </div>

            <div class="field">
              <p class="control is-expanded">
                <button class="button is-info">Next</button>
              </p>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="field">
              <label class="label">
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
              <label class="label">
                ZipCode <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input className="input" type="number" placeholder="Zip Code" />
              </p>
            </div>
            <div className="field">
              <label class="label">
                City <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input className="input" type="text" placeholder="City" />
              </p>
            </div>

            <div className="field">
              <label class="label">
                Country <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input className="input" type="text" placeholder="Country" />
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
        marginRight: 50,
        marginLeft: 50,
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
        {renderStepperButton("Name", "lightgreen", faCheck)}
        {renderStepperButton("Address", "#777", fa2)}
        {renderStepperButton("ID/Password", "#777", fa3)}
        <div
          style={{
            width: 230,
            height: 4,
            backgroundColor: "#000",
            position: "absolute",
            top: "25%",
            zIndex: 0,
          }}
        />
      </div>

      {renderFormBody(1)}

      <div class="field" style={{ marginTop: 50 }}>
        <p class="control">
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
