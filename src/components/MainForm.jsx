import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  fa1,
  fa2,
  fa3,
  fa4,
  faAdd,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { Formik } from "formik";

import { useAuth } from "../contexts/AuthContext";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

function MainForm() {
  const [step, setStep] = useState(1);

  const [showKeywordsList, setShowKeywordsList] = useState(false);

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

  async function handleSubmission(e) {
    e.preventDefault();
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
      <span style={{ width: 200, textAlign: "center" }}>{title}</span>
    </div>
  );

  const renderFormBody = (step) => {
    switch (step) {
      case 1:
        return (
          <div className="" id="form1">
            <div className="field">
              <label className="label">
                Title <span style={{ color: "red" }}>*</span>
              </label>

              <span
                style={{
                  backgroundColor: "red",
                  color: "#fff",
                  paddingLeft: 4,
                  paddingRight: 4,
                  borderRadius: 5,
                }}
              >
                Title should be of minimum 20 words
              </span>
              <p className="control">
                <textarea
                  className="textarea is-danger"
                  type="text"
                  placeholder="Title"
                  rows="4"
                />
              </p>
            </div>

            {/* ABSTRACT */}
            <div className="field">
              <label className="label">
                Abstract <span style={{ color: "red" }}>*</span>
              </label>

              <span
                style={{
                  backgroundColor: "red",
                  color: "#fff",
                  paddingLeft: 4,
                  paddingRight: 4,
                  borderRadius: 5,
                }}
              >
                Abstract should be of minimum 250 words
              </span>
              <p className="control">
                <textarea
                  className="textarea is-danger"
                  type="text"
                  placeholder="Abstract"
                  rows="8"
                />
              </p>
            </div>

            {/* Additional Material */}
            <div className="field">
              <label className="label">Additional Material</label>

              <p className="control">
                <textarea
                  className="textarea"
                  type="text"
                  placeholder="Additional Material"
                  rows="3"
                />
              </p>
            </div>

            {/* Keywords */}
            <Select options={options} />
            <div className="field">
              <label className="label">Keywords</label>

              <p className="control">
                <div className="field has-addons">
                  <div className="control">
                    <Select style={{ width: "50%" }} options={options} />
                  </div>
                  <div className="control">
                    <a className="button is-info">
                      <FontAwesomeIcon icon={faAdd} />
                      <span style={{ marginLeft: 5 }}>Add</span>
                    </a>
                  </div>
                </div>
              </p>
            </div>
          </div>
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
              <p className="control">
                <input className="input" type="text" placeholder="Country" />
              </p>
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
      case 4:
        return (
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid email address";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {errors.email && touched.email && errors.email}
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {errors.password && touched.password && errors.password}
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </form>
            )}
          </Formik>
        );
    }
  };

  return (
    <>
      <div
        style={{
          marginTop: 50,
          marginRight: "10%",
          marginLeft: "10%",
          padding: 35,
          border: "1px solid #ccc",
          borderRadius: 20,
        }}
      >
        <div className="title">Submission</div>

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
          {renderStepperButton("Metadata", "hsl(204, 86%, 53%)", fa1, 1)}
          {renderStepperButton("Upload Files", "hsl(204, 86%, 53%)", fa2, 2)}
          {renderStepperButton(
            "Keywords & Addresses",
            "hsl(204, 86%, 53%)",
            fa3,
            3
          )}
          {renderStepperButton(
            "Review Your Submission",
            "hsl(204, 86%, 53%)",
            fa4,
            4
          )}

          <div
            style={{
              width: "75%",
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

        <form>
          {renderFormBody(step)}
          <div className="field">
            <p className="control is-expanded">
              <button
                onClick={handleSubmission}
                disabled={loading}
                className="button is-info is-right"
              >
                {step == 3 ? "Register" : "Next"}
              </button>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default MainForm;
