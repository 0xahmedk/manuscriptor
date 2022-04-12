import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faXmark,
  fa1,
  fa2,
  fa3,
  faEye,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

import Select from "react-select";

import { countries } from "../modules/countries";
import { getUnis } from "../modules/universities";
import { useAuth } from "../contexts/FirebaseContext";
import SideLogo from "./SideLogo";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, usersColRef } from "../firebase";

function Register() {
  const [viewPassword1, setViewPassword1] = useState(false);
  const [viewPassword2, setViewPassword2] = useState(false);
  const [agreeTermsAndConditions, setAgreeTermsAndConditions] = useState(false);
  const [step, setStep] = useState(1);

  const [institutionsOptions, setInstitutionsOptions] = useState([]);

  const [state, setState] = useState({
    email: "",
    password: "",
    cpassword: "",
  });

  const { email, password, cpassword } = state;
  const setInstitutionsOptionsC = (unis) => {
    let universities = [];

    for (const u of unis) {
      universities.push({ label: u.name, value: u.name });
    }

    setInstitutionsOptions(universities);
    console.log(institutionsOptions);
  };

  useMemo(async () => {
    await fetch(`http://universities.hipolabs.com/search?country=pakistan`)
      .then((res) => res.json())
      .then((unis) => {
        setInstitutionsOptionsC(unis);
      })
      .catch((error) => console.log(error));
  }, []);

  const [forms, setForms] = useState([
    {
      data: {
        prefix: "",
        firstName: "",
        middleName: "",
        lastName: "",
        degree: "",
        institution: {
          value: "",
          label: "Select Institution",
        },
        department: "",
      },
      errors: null,
      isCompleted: false,
    },
    {
      data: {
        phoneNumber: 0,
        fax: 0,
        street: "",
        zipcode: 0,
        city: "",
        country: "",
      },
      errors: null,
      isCompleted: false,
    },
    {
      data: {},
      errors: null,
      isCompleted: false,
    },
  ]);

  const handleInputs = (e, step) => {
    forms[step - 1] = {
      ...forms[step - 1],
      data: {
        ...forms[step - 1].data,
        [e.target.name]: e.target.value,
      },
    };
    setForms([...forms]);
  };

  const decideStepperButtonColor = (i) => {
    return forms[i].isCompleted
      ? "green"
      : forms[i].errors === null
      ? "hsl(204, 86%, 53%)"
      : "red";
  };
  const decideStepperButtonIcon = (i) => {
    let icon;
    if (forms[i].isCompleted) {
      icon = faCheck;
    } else {
      if (forms[i].errors === null) {
        switch (i + 1) {
          case 1:
            icon = fa1;
            break;
          case 2:
            icon = fa2;
            break;
          case 3:
            icon = fa3;
            break;

          default:
            break;
        }
      } else {
        icon = faXmark;
      }
    }
    return icon;
  };

  const addErrorsToFormsState = (errs, step) => {
    forms[step - 1] = {
      ...forms[step - 1],
      errors: errs,
      isCompleted: false,
    };
    setForms([...forms]);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const setErrorsToNull = (step) => {
    forms[step - 1] = {
      ...forms[step - 1],
      errors: null,
      isCompleted: true,
    };
    setForms([...forms]);

    if (step !== 3) setStep(step + 1);

    window.scrollTo({
      top: 0,
      left: 0,
    });
  };

  const setErrorsToTrue = (step) => {
    forms[step - 1] = {
      ...forms[step - 1],
      errors: ["Please fill out this form!"],
    };
    setForms([...forms]);
  };

  async function handleSubmission(e) {
    e.preventDefault();

    // Check for errs

    if (step !== 3) {
      let errs = [];
      switch (step) {
        case 1:
          if (forms[0].data.prefix === "") {
            errs.push("Please select a Prefix for your name");
          }
          if (forms[0].data.firstName === "") {
            errs.push("Please enter your First Name");
          }

          if (forms[0].data.lastName === "") {
            errs.push("Please enter your Last Name");
          }
          if (forms[0].data.department === "") {
            errs.push("Please enter your Department");
          }
          // if (forms[0].data.institution.value === "") {
          //   errs.push("Please enter your Institution");
          // }

          if (errs.length != 0) {
            addErrorsToFormsState(errs, step);
          } else {
            setErrorsToNull(step);
          }
          break;
        case 2:
          if (forms[1].data.phoneNumber === 0) {
            errs.push("Please enter your Phone Number");
          }

          if (forms[1].data.city === "") {
            errs.push("Please enter your City");
          }
          if (forms[1].data.country === "") {
            errs.push("Please select a Country");
          }
          if (errs.length != 0) {
            addErrorsToFormsState(errs, step);
          } else {
            setErrorsToNull(step);
          }
          break;
        default:
          break;
      }
    } else {
      let errs = [];
      if (!forms[0].isCompleted) {
        errs.push("Please complete the Personal Information (Step 1) first ");
        setErrorsToTrue(1);
        addErrorsToFormsState(errs, step);
        if (!forms[1].isCompleted) {
          errs.push("Please complete the Address Information (Step 2) first");
          setErrorsToTrue(2);
          addErrorsToFormsState(errs, step);
          if (!agreeTermsAndConditions) {
            errs.push("Please agree to terms and conditions");
            addErrorsToFormsState(errs, step);
            return;
          }

          return;
        }
        return;
      }

      setErrorsToNull(step);

      //Register
      handleRegister();
    }
  }

  const { auth, addUser, fileUploadStart } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  async function handleRegister() {
    setSuccess(false);

    if (password !== cpassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Passwords must be 6 characters long!");
    }

    setError("");
    setLoading(true);
    fileUploadStart(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        async () => {
          updateProfile(auth.currentUser, {
            displayName: forms[0].data.firstName,
          });

          await setDoc(doc(db, "users", auth.currentUser.uid), { forms })
            .then(() => {
              setSuccess(true);
              setTimeout(() => {
                fileUploadStart(false);

                sendEmailVerification(auth.currentUser)
                  .then(() => {
                    alert(
                      "Email verification link send to your email address!"
                    );
                  })
                  .catch((err) => console.log(err.message));

                navigate("/login");
              }, 10000);
            })
            .catch((err) => console.log(err.message));
        }
      );
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
    fileUploadStart(false);
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
          cursor: "pointer",
          height: 30,
          borderRadius: "50%",
          textAlign: "center",
          backgroundColor:
            stp == step
              ? "hsl(204, 86%, 53%)"
              : forms[stp - 1].isCompleted
              ? "green"
              : color === "red"
              ? color
              : "#777",
          marginBottom: 5,
        }}
        onClick={() => setStep(stp)}
      >
        <FontAwesomeIcon icon={icon} color="#fff" />
      </button>
      <span style={{ width: 90, textAlign: "center", marginTop: -5 }}>
        {title}
      </span>
    </div>
  );

  const renderFormBody = (step) => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="field">
              {forms[step - 1].data.prefix !== "" ? (
                <div className="select is-success">
                  <select
                    name="prefix"
                    value={forms[step - 1].data.prefix}
                    onChange={(e) => {
                      if (e.target.value == "Select Prefix") {
                        forms[step - 1] = {
                          ...forms[step - 1],
                          data: {
                            ...forms[step - 1].data,
                            prefix: "",
                          },
                        };
                        setForms([...forms]);
                      } else {
                        handleInputs(e, step);
                      }
                    }}
                  >
                    <option>Select Prefix</option>
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Dr.</option>
                    <option>Prof.</option>
                  </select>
                </div>
              ) : (
                <div className="select is-danger">
                  <select
                    name="prefix"
                    value={forms[step - 1].data.prefix}
                    onChange={(e) => {
                      if (e.target.value == "Select Prefix") {
                        forms[step - 1] = {
                          ...forms[step - 1],
                          data: {
                            ...forms[step - 1].data,
                            prefix: "",
                          },
                        };
                        setForms([...forms]);
                      } else {
                        handleInputs(e, step);
                      }
                    }}
                  >
                    <option>Select Prefix</option>
                    <option>Mr.</option>
                    <option>Ms.</option>
                    <option>Dr.</option>
                    <option>Prof.</option>
                  </select>
                </div>
              )}

              {"  "}
              <span style={{ color: "red" }}>*</span>
            </div>

            <div className="field">
              <label className="label">
                First Name <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={forms[step - 1].data.firstName}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Middle Name</label>
              <p className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Middle Name"
                  name="middleName"
                  value={forms[step - 1].data.middleName}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>
            <div className="field">
              <label className="label">
                Last Name <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={forms[step - 1].data.lastName}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>

            <div className="field">
              <label className="label">Degree</label>
              <p className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Degree"
                  name="degree"
                  value={forms[step - 1].data.degree}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Institution</label>
              <Select
                placeholder="Select Institution"
                options={institutionsOptions}
                value={forms[step - 1].data.institution}
                onChange={(item) => {
                  forms[step - 1] = {
                    ...forms[step - 1],
                    data: {
                      ...forms[step - 1].data,
                      institution: {
                        label: item.label,
                        value: item.value,
                      },
                    },
                  };
                  setForms([...forms]);
                }}
              />
            </div>

            <div className="field">
              <label className="label">
                Department<span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Department"
                  name="department"
                  value={forms[step - 1].data.department}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="field">
              <label className="label">
                Phone # <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={forms[step - 1].data.phoneNumber}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Fax</label>
              <p className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="Fax"
                  name="fax"
                  value={forms[step - 1].data.fax}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>
            <div className="field">
              <label className="label">Address</label>
              <p className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Street No"
                  name="street"
                  value={forms[step - 1].data.street}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>
            <div className="field">
              <label className="label">ZipCode</label>
              <p className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="Zip Code"
                  name="zipcode"
                  value={forms[step - 1].data.zipcode}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>
            <div className="field">
              <label className="label">
                City <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <p className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="City"
                  name="city"
                  value={forms[step - 1].data.city}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>

            <div className="field">
              <label className="label">
                Country <span style={{ color: "red" }}>*</span>{" "}
              </label>
              <div class="select">
                <select
                  name="country"
                  value={forms[step - 1].data.country}
                  onChange={(e) => {
                    if (e.target.value == "Select Country") {
                      forms[step - 1] = {
                        ...forms[step - 1],
                        data: {
                          ...forms[step - 1].data,
                          prefix: "",
                        },
                      };
                      setForms([...forms]);
                    } else {
                      handleInputs(e, step);
                    }
                  }}
                >
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
              <label class="label">
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <p className="control has-icons-left has-icons-right">
                <input
                  required
                  className="input"
                  type={viewPassword1 ? "text" : "password"}
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
                    color: viewPassword1 ? "black" : "#7774",
                  }}
                  onClick={() => setViewPassword1(!viewPassword1)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </i>
              </p>
              <p class="help">Password should be 6 characters long minimum</p>
            </div>
            <div className="field">
              <label class="label">
                Confrim Password <span style={{ color: "red" }}>*</span>
              </label>
              <p className="control has-icons-left has-icons-right">
                <input
                  required
                  className="input"
                  type={viewPassword2 ? "text" : "password"}
                  placeholder="Confrim Password"
                  name="cpassword"
                  value={cpassword}
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
                    color: viewPassword2 ? "black" : "#7774",
                  }}
                  onClick={() => setViewPassword2(!viewPassword2)}
                >
                  <FontAwesomeIcon icon={faEye} />
                </i>
              </p>
            </div>
            <div className="block" />

            <label class="checkbox">
              <input
                checked={agreeTermsAndConditions}
                type="checkbox"
                onChange={() =>
                  setAgreeTermsAndConditions(!agreeTermsAndConditions)
                }
              />
              <span style={{ color: "red", marginLeft: 5 }}>*</span>I agree to
              all of Terms and Conditions.
            </label>
            <div className="block" />
          </>
        );
    }
  };

  return (
    <div className="columns">
      <div className="column is-half">
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
          <div className="title">Register A User</div>

          {/* Stepper*/}
          {/* Errors Notification */}
          {forms[step - 1].errors !== null && (
            <>
              <div class="notification is-danger is-light pl-6">
                <h3>Errors:</h3>
                <ul style={{ listStyleType: "disc" }}>
                  {forms[step - 1].errors.map((e) => (
                    <li>
                      <strong>{e}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
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
            {renderStepperButton(
              "Personal Information",
              decideStepperButtonColor(0),
              decideStepperButtonIcon(0),
              1
            )}
            {renderStepperButton(
              "Address Information",
              decideStepperButtonColor(1),
              decideStepperButtonIcon(1),
              2
            )}
            {renderStepperButton(
              "Account Information",
              decideStepperButtonColor(2),
              decideStepperButtonIcon(2),
              3
            )}

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

          <form>{renderFormBody(step)}</form>

          <div className="field" style={{ marginTop: 15 }}>
            <p className="control">
              <span className="block" style={{ alignSelf: "flex-end" }}>
                Already have an account?{" "}
                <Link to={{ pathname: "/login" }}>Login </Link>
              </span>
              instead.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 5,
            }}
          >
            {loading ? (
              <button
                style={{ marginLeft: 5 }}
                onClick={handleSubmission}
                disabled={loading}
                className="button is-info is-loading"
              >
                {step == 3 ? "Register Account" : "Next"}
              </button>
            ) : (
              <button
                style={{ marginLeft: 5 }}
                onClick={handleSubmission}
                className="button is-info"
              >
                {step == 3 ? "Create Account" : "Next"}
              </button>
            )}
          </div>
        </div>{" "}
      </div>
      <div className="column is-half">
        <SideLogo />
      </div>
    </div>
  );
}

export default Register;
