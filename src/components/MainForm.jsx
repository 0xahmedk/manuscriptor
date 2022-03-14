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
  faRemove,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import CreatableSelect from "react-select/creatable";
import LoadingOverlay from "react-loading-overlay";

import { useAuth } from "../contexts/FirebaseContext";
import FileUploadTester from "./FileUploadTester";
import ReviewAndSubmit from "./ReviewAndSubmit";

function MainForm() {
  let navigate = useNavigate();

  const [submissionType, setSubmissionType] = useState("asd");

  const [forms, setForms] = useState([
    {
      data: {
        title: "",
        abstract: "",
        addMaterial: "",
      },
      errors: null,
      isCompleted: false,
    },
    {
      data: {},
      errors: null,
      isCompleted: false,
    },
    {
      data: {},
      errors: null,
      isCompleted: false,
    },
    {
      data: {},
      errors: null,
      isCompleted: false,
    },
  ]);

  const [step, setStep] = useState(4);

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
          case 4:
            icon = fa4;
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

  const { currentUser } = useAuth();

  const [author, setAuthor] = useState({
    name: "",
    email: "",
    orcid: "",
    institution: "",
  });

  const [authorsList, setAuthorsList] = useState([
    {
      name: "Ahmed",
      email: currentUser.email,
      orcid: "1234-1234-1234-1234",
      institution: "International Islamic University, Islamabad",
    },
  ]);

  const onInputChangeAuthor = (e) => {
    setAuthor({ ...author, [e.target.name]: e.target.value });
  };

  const [options, setOptions] = useState([
    { value: "accounting", label: "Accounting" },
    { value: "business history", label: "Business history" },
    { value: "business law", label: "Business law" },
  ]);
  const [addedKeywords, setAddedKeywords] = useState([]);
  const [currentSelectVal, setCurrentSelectVal] = useState({
    value: "",
    label: "Select Value",
  });
  const [showKeywordsList, setShowKeywordsList] = useState(false);

  const [state, setState] = useState({
    email: "",
    password: "",
    cpassword: "",
  });

  const [toggleAuthorModal, setToggleAuthorModal] = useState(false);

  const { email, password, cpassword } = state;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

    setStep(step + 1);
  };

  async function handleSubmission(e) {
    e.preventDefault();

    // Check for errs

    if (step !== 4) {
      let errs = [];

      switch (step) {
        case 1:
          if (forms[0].data.title < 50) {
            errs.push("Title should be of minimum 50 characters");
          }
          if (forms[0].data.abstract < 500) {
            errs.push("Abstract should be of minimum 500 characters");
          }
          if (addedKeywords.length < 3) {
            errs.push("There should be minimum 3 keywords");
          }
          if (errs.length != 0) {
            addErrorsToFormsState(errs, step);
          } else {
            setErrorsToNull(step);
          }
          break;
        case 2:
          for (const f of filesSelected) {
            if (f == "") {
              errs.push("Please Upload at least 4 files!");
              break;
            }
          }
          if (errs.length != 0) {
            addErrorsToFormsState(errs, step);
          } else {
            setErrorsToNull(step);
          }
          break;
        case 3:
          if (coverLetter == "") {
            errs.push("Please write the cover the letter!");
          }
          if (!(isConfirmed1 && isConfirmed2 && isConfirmed3)) {
            errs.push(
              "Please check all the confirmation statements given below!"
            );
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
      //submit paper
    }
  }

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
      <span style={{ width: 200, textAlign: "center" }}>{title}</span>
    </div>
  );

  // Form Step 2 states
  const [fileTypeSelect, setFileTypeSelect] = useState(["", "", "", ""]);
  const [filesSelected, setFilesSelected] = useState(new Array(4).fill(""));
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const checkIfAllFilesSelected = () => {
    for (const element of filesSelected) {
      if (element == "") return false;
    }
    return true;
  };

  const [progress, setProgress] = useState(0);
  const [url, setURL] = useState("");

  const handleFiles = (e) => {
    e.preventDefault();

    let files = [];
    if (e.target.name === "resume") {
      console.log(e.target.file);
    }
  };

  // const uploadFile = (file) => {
  //   if (!file) return;

  //   const storageRef = ref(storage, `/files/${file.name}`);
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   uploadTask.on(
  //     "state_changed",
  //     (snapshot) => {
  //       const prog = Math.round(
  //         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //       );
  //       setProgress(prog);
  //     },
  //     (err) => console.log(err),
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((u) => setURL(u));
  //       console.log(url);
  //     }
  //   );

  //   return { url, progress };
  // };

  const getFormattedTimeDate = () => {
    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      "(" +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ")";
    return date;
  };

  // Form 3 states
  const [toggleFundingModal, setToggleFundingModal] = useState(false);

  const [funder, setFunder] = useState({
    findfunder: "",
    grantrecep: "",
    awardnumber: 0,
  });

  const [fundersList, setFundersList] = useState([
    {
      findfunder: "Ahmed",
      grantrecep: "Mudud",
      awardnumber: 12345,
    },
  ]);

  const [coverLetter, setCoverLetter] = useState("");

  const [isConfirmed1, setIsConfirmed1] = useState(false);
  const [isConfirmed2, setIsConfirmed2] = useState(false);
  const [isConfirmed3, setIsConfirmed3] = useState(false);

  const onInputChangeFunder = (e) => {
    setFunder({ ...funder, [e.target.name]: e.target.value });
  };

  ////////////---------///////////

  const renderFormBody = (step) => {
    switch (step) {
      case 1:
        return (
          <div className="" id="form1">
            <div className="field">
              <label className="label">
                Title <span style={{ color: "red" }}>*</span>
              </label>
              {forms[step - 1].data.title.length < 50 ? (
                <span
                  style={{
                    backgroundColor: "red",
                    color: "#fff",
                    paddingLeft: 4,
                    paddingRight: 4,
                    borderRadius: 5,
                  }}
                >
                  Title should be of minimum 50 characters
                </span>
              ) : (
                <span
                  style={{
                    backgroundColor: "green",
                    color: "#fff",
                    paddingLeft: 4,
                    paddingRight: 4,
                    borderRadius: 5,
                  }}
                >
                  Your title is fine!
                </span>
              )}

              {forms[step - 1].data.title.length < 50 ? (
                <p className="control">
                  <textarea
                    className="textarea is-danger"
                    type="text"
                    placeholder="Title"
                    rows="4"
                    name="title"
                    value={forms[step - 1].data.title}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                </p>
              ) : (
                <p className="control">
                  <textarea
                    className="textarea is-success"
                    type="text"
                    placeholder="Title"
                    rows="4"
                    name="title"
                    value={forms[step - 1].data.title}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                </p>
              )}
            </div>

            {/* ABSTRACT */}
            <div className="field">
              <label className="label">
                Abstract <span style={{ color: "red" }}>*</span>
              </label>

              {forms[step - 1].data.abstract.length < 500 ? (
                <span
                  style={{
                    backgroundColor: "red",
                    color: "#fff",
                    paddingLeft: 4,
                    paddingRight: 4,
                    borderRadius: 5,
                  }}
                >
                  Abstract should be of minimum 500 characters
                </span>
              ) : (
                <span
                  style={{
                    backgroundColor: "green",
                    color: "#fff",
                    paddingLeft: 4,
                    paddingRight: 4,
                    borderRadius: 5,
                  }}
                >
                  Your Abstract is fine!
                </span>
              )}

              {forms[step - 1].data.abstract.length < 500 ? (
                <p className="control">
                  <textarea
                    className="textarea is-danger"
                    type="text"
                    placeholder="Abstract"
                    rows="8"
                    name="abstract"
                    value={forms[step - 1].data.abstract}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                </p>
              ) : (
                <p className="control">
                  <textarea
                    className="textarea is-success"
                    type="text"
                    placeholder="Abstract"
                    rows="8"
                    name="abstract"
                    value={forms[step - 1].data.abstract}
                    onChange={(e) => {
                      handleInputs(e, step);
                    }}
                  />
                </p>
              )}
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
                  name="addMaterial"
                  value={forms[step - 1].data.addMaterial}
                  onChange={(e) => {
                    handleInputs(e, step);
                  }}
                />
              </p>
            </div>

            {/* Keywords */}
            <label className="label">
              Keywords<span style={{ color: "red" }}>*</span>
            </label>

            <span
              style={{
                backgroundColor:
                  addedKeywords.length < 3 || addedKeywords.length > 5
                    ? "red"
                    : "green",
                color: "#fff",
                paddingLeft: 4,
                paddingRight: 4,
                borderRadius: 5,
              }}
            >
              Min. 3, Max 5
            </span>
            <div className="block">
              <CreatableSelect
                placeholder="Select Keyword"
                isDisabled={addedKeywords.length > 4 ? true : false}
                options={options}
                value={currentSelectVal}
                onChange={(item) => setCurrentSelectVal(item)}
                onCreateOption={(newValue) => {
                  newValue.split(/,+|,\s+/g).forEach((item) => {
                    addedKeywords.push({
                      value: item,
                      label: item.charAt(0).toUpperCase() + item.slice(1),
                    });
                  });

                  setAddedKeywords([...addedKeywords]);
                }}
              />
            </div>
            <div className="block">
              {" "}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <p className="control"></p>

                <button
                  onClick={() => {
                    if (currentSelectVal.value != "")
                      addedKeywords.push(currentSelectVal);
                    setAddedKeywords([...addedKeywords]);
                    setCurrentSelectVal({
                      value: "",
                      label: "Select Value",
                    });
                    setOptions(
                      options.filter(function (el) {
                        return el.value != currentSelectVal.value;
                      })
                    );
                  }}
                  className="button is-info"
                >
                  <FontAwesomeIcon icon={faAdd} />
                  <span style={{ marginLeft: 5 }}>Add Keyword</span>
                </button>
              </div>
            </div>

            <div className="field">
              <div className="card">
                <div className="card-header">
                  <p className="card-header-title">Keywords</p>
                </div>
                <div className="card-content">
                  <div className="content">
                    {addedKeywords.length == 0 && (
                      <div className="has-text-centered">No keywords added</div>
                    )}
                    {addedKeywords.map((keyword) => (
                      <div
                        key={keyword.value}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          paddingRight: 10,
                          paddingLeft: 10,
                          height: 50,
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        <div style={{ fontWeight: "600" }}>{keyword.label}</div>
                        <button
                          onClick={() => {
                            options.push(keyword);
                            setOptions([...options]);

                            setAddedKeywords(
                              addedKeywords.filter(function (el) {
                                return el.value != keyword.value;
                              })
                            );
                          }}
                          className="button is-danger is-round is-small"
                        >
                          <FontAwesomeIcon color="white" icon={faRemove} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="block" />

            {/* Add Author  */}
            <label className="label">Authors</label>
            {/* Modals */}
            {toggleAuthorModal && (
              <div className="modal is-active is-clipped">
                <div className="modal-background"></div>
                <div className="modal-card">
                  <header className="modal-card-head px-6">
                    <p className="modal-card-title">Add Author</p>
                    <button
                      onClick={() => setToggleAuthorModal(false)}
                      className="delete"
                      aria-label="close"
                    ></button>
                  </header>
                  <section className="modal-card-body">
                    <div className="field is-horizontal">
                      {/* Author Name */}
                      <div className="field-label is-normal">
                        <label className="label">Name</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Name"
                              name="name"
                              value={author.name}
                              onChange={onInputChangeAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Author Email */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Email</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Email"
                              name="email"
                              value={author.email}
                              onChange={onInputChangeAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Author ORCID */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">ORCID</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="ORCID with dashes"
                              name="orcid"
                              value={author.orcid}
                              onChange={onInputChangeAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Author Institution */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Institution</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Institution"
                              name="institution"
                              value={author.institution}
                              onChange={onInputChangeAuthor}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <footer className="modal-card-foot">
                    <button
                      onClick={() => {
                        authorsList.push(author);
                        setAuthorsList(authorsList);
                        setToggleAuthorModal(false);
                      }}
                      className="button is-info"
                    >
                      Add Author
                    </button>
                    <button
                      onClick={() => setToggleAuthorModal(false)}
                      className="button"
                    >
                      Cancel
                    </button>
                  </footer>
                </div>
              </div>
            )}

            {/* Author Button */}
            <div className="field">
              <button
                onClick={() => setToggleAuthorModal(true)}
                className="button is-info"
              >
                <FontAwesomeIcon icon={faAdd} />
                <span style={{ marginLeft: 5 }}>Add Author</span>
              </button>
            </div>
            <div className="block" />

            {/* Authors Table */}
            <table className="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Author</th>
                  <th>ORCID</th>
                  <th>Institution</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr></tr>
              </tfoot>
              <tbody>
                {authorsList.length == 0 && (
                  <td className="has-text-centered">No Authors added</td>
                )}
                {authorsList.map((a) => (
                  <tr key={a.orcid}>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.orcid}</td>
                    <td>{a.institution}</td>
                    <td>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure to delete author named ${a.name}?`
                            )
                          ) {
                            setAuthorsList(
                              authorsList.filter(function (el) {
                                return el.orcid != a.orcid;
                              })
                            );
                          }
                        }}
                        className="button is-danger is-round is-small"
                      >
                        <FontAwesomeIcon color="white" icon={faRemove} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="block" />
          </div>
        );

      case 2:
        return (
          <div className="form2">
            {/* Upload Files */}

            {/* Pick Files */}
            <form onSubmit={handleFiles}>
              <label className="label">
                Pick Files<span style={{ color: "red" }}>*</span>
              </label>
              <table className="table is-striped is-hoverable">
                <thead>
                  <tr>
                    <th>File Type</th>
                    <th>File</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filesSelected.map((_, i) => (
                    <tr key={i}>
                      <td>
                        <div className="select">
                          <select
                            value={fileTypeSelect[i]}
                            onChange={(e) => {
                              if (e.target.value == "Select File Type") {
                                fileTypeSelect[i] = "";
                                setFileTypeSelect([...fileTypeSelect]);
                              } else {
                                fileTypeSelect[i] = e.target.value;
                                setFileTypeSelect([...fileTypeSelect]);
                              }
                            }}
                            disabled={filesSelected[i] != "" ? true : false}
                          >
                            <option>Select File Type</option>
                            <option value="Title Page">Title Page</option>
                            <option>Article File</option>
                            <option>Figure</option>
                            <option>Table</option>
                            <option>Author Biography</option>
                            <option>Suplementary File not for Review</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        {fileTypeSelect[i] != "" &&
                          (filesSelected[i] == "" ? (
                            <div className="file has-name">
                              <label className="file-label">
                                <input
                                  className="file-input"
                                  type="file"
                                  name="resume"
                                  accept=".*"
                                  value={filesSelected[i]}
                                  onChange={(e) => {
                                    filesSelected[i] = e.target.value;
                                    setFilesSelected([...filesSelected]);
                                  }}
                                />
                                <span className="file-cta">
                                  <span className="file-icon">
                                    <FontAwesomeIcon
                                      color="black"
                                      icon={faUpload}
                                    />
                                  </span>
                                  <span className="file-label">
                                    Choose a file…
                                  </span>
                                </span>
                                <span className="file-name">
                                  {filesSelected[i]}
                                </span>
                              </label>
                            </div>
                          ) : (
                            <div className="file has-name is-success">
                              <label className="file-label">
                                <input
                                  className="file-input"
                                  type="file"
                                  name="resume"
                                  accept=".*"
                                  value={filesSelected[i]}
                                  onChange={(e) => {
                                    console.log(e.target.files);
                                    filesSelected[i] = e.target.value;
                                    setFilesSelected([...filesSelected]);
                                  }}
                                />
                                <span className="file-cta">
                                  <span className="file-icon">
                                    <FontAwesomeIcon
                                      color="white"
                                      icon={faUpload}
                                    />
                                  </span>
                                  <span className="file-label">
                                    Change file…
                                  </span>
                                </span>
                                <span className="file-name">
                                  {filesSelected[i]}
                                </span>
                              </label>
                            </div>
                          ))}
                      </td>
                      <td>
                        {filesSelected[i] != "" && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure to remove file named ${filesSelected[i]}?`
                                )
                              ) {
                                filesSelected[i] = "";
                                setFileTypeSelect[i] = "";
                                setFilesSelected([...filesSelected]);
                              }
                            }}
                            className="button is-danger is-round is-small"
                          >
                            <FontAwesomeIcon color="white" icon={faRemove} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Upload Button */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  disabled={checkIfAllFilesSelected() ? false : true}
                  className="button is-info"
                  type="submit"
                >
                  <span className="icon is-small">
                    <FontAwesomeIcon color="white" icon={faUpload} />
                  </span>
                  <span>Upload Selected Files</span>
                </button>
              </div>
              <div className="block" />
            </form>

            {/* Uploaded Files Table */}
            <label className="label">
              Uploaded Files
              <span
                style={{
                  marginLeft: 5,
                  padding: 3,
                  backgroundColor: "green",
                  borderRadius: 5,
                }}
              >
                <FontAwesomeIcon color="white" icon={faCheck} size="1x" />
              </span>
            </label>
            <table className="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>File Type</th>
                  <th>Upload Time</th>
                  <th>Uploaded By</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {/* {fundersList.length == 0 && (
                  <td className="has-text-centered">No funders added</td>
                )} */}
                <tr>
                  <td>Screenshot from 2022-03-11 11-28-19.png</td>
                  <td>Title Page</td>
                  <td>{getFormattedTimeDate()}</td>
                  <td>Ahmed Khan</td>
                  <td>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(`Are you sure to delete author named?`)
                        ) {
                          // setAuthorsList(
                          //   authorsList.filter(function (el) {
                          //     return el.orcid != a.orcid;
                          //   })
                          // );
                        }
                      }}
                      className="button is-danger is-round is-small"
                    >
                      <FontAwesomeIcon color="white" icon={faRemove} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="block" />
          </div>
        );
      case 3:
        return (
          <div className="form3">
            {/* Cover Letter */}
            <div className="field">
              <label className="label">
                Cover Letter <span style={{ color: "red" }}>*</span>
              </label>

              {coverLetter === "" ? (
                <p className="control">
                  <textarea
                    className="textarea is-danger"
                    type="text"
                    placeholder="Cover Letter"
                    rows="5"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </p>
              ) : (
                <p className="control">
                  <textarea
                    className="textarea is-success"
                    type="text"
                    placeholder="Cover Letter"
                    rows="5"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </p>
              )}
            </div>

            {/* Funding */}

            {/* Add Funding  */}
            <label className="label">
              Add Funding<span style={{ color: "red" }}>*</span>
            </label>
            {/* Modals */}
            {toggleFundingModal && (
              <div className="modal is-active is-clipped">
                <div className="modal-background"></div>
                <div className="modal-card">
                  <header className="modal-card-head px-6">
                    <p className="modal-card-title">Add Funding</p>
                    <button
                      onClick={() => setToggleFundingModal(false)}
                      className="delete"
                      aria-label="close"
                    ></button>
                  </header>
                  <section className="modal-card-body">
                    <div className="field is-horizontal">
                      {/* Find a Funder */}
                      <div className="field-label is-normal">
                        <label className="label">Find a Funder</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Find a Funder"
                              name="findfunder"
                              value={funder.findfunder}
                              onChange={onInputChangeFunder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Award Number */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Award Number </label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="number"
                              placeholder="Award Number "
                              name="awardnumber"
                              value={funder.awardnumber}
                              onChange={onInputChangeFunder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Grant Recepient  */}
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Grant Recepient</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="Grant Recepient"
                              name="grantrecep"
                              value={funder.grantrecep}
                              onChange={onInputChangeFunder}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <footer className="modal-card-foot">
                    <button
                      onClick={() => {
                        fundersList.push(funder);
                        setFundersList(fundersList);
                        setToggleFundingModal(false);
                      }}
                      className="button is-info"
                    >
                      Add Funder
                    </button>
                    <button
                      onClick={() => setToggleFundingModal(false)}
                      className="button"
                    >
                      Cancel
                    </button>
                  </footer>
                </div>
              </div>
            )}

            {/* Funders Button */}
            <div className="field">
              <button
                onClick={() => setToggleFundingModal(true)}
                className="button is-info"
              >
                <FontAwesomeIcon icon={faAdd} />
                <span style={{ marginLeft: 5 }}>Add Funder</span>
              </button>
            </div>
            <div className="block" />

            {/* Funders Table */}
            <table className="table is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Funder</th>
                  <th>Award Number</th>
                  <th>Grant Recepient</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tfoot>
                <tr></tr>
              </tfoot>
              <tbody>
                {fundersList.length == 0 && (
                  <td className="has-text-centered">No funders added</td>
                )}
                {fundersList.map((f) => (
                  <tr>
                    <td>{f.findfunder}</td>
                    <td>{f.awardnumber}</td>
                    <td>{f.grantrecep}</td>
                    <td>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              `Are you sure to delete funder named ${f.findfunder}?`
                            )
                          ) {
                            setFundersList(
                              fundersList.filter(function (el) {
                                return el.awardnumber != f.awardnumber;
                              })
                            );
                          }
                        }}
                        className="button is-danger is-round is-small"
                      >
                        <FontAwesomeIcon color="white" icon={faRemove} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="block" />

            {/* Cofirmation */}
            <div className="field">
              <label className="label">
                <strong>Confirm the following:</strong>
              </label>
              <div className="block" />

              <label class="checkbox">
                <input
                  checked={isConfirmed1}
                  type="checkbox"
                  onChange={() => setIsConfirmed1(!isConfirmed1)}
                />
                <span style={{ color: "red", marginLeft: 5 }}>*</span>
                Confirm that the manuscript has been submitted solely to this
                journal and is not published, in press, or submitted elsewhere.
              </label>
              <div className="block" />

              <label class="checkbox">
                <input
                  checked={isConfirmed2}
                  type="checkbox"
                  onChange={() => setIsConfirmed2(!isConfirmed2)}
                />
                <span style={{ color: "red", marginLeft: 5 }}>*</span>
                Confirm that all the research meets the ethical guidelines,
                including adherence to the legal requirements of the study
                country.
              </label>
              <div className="block" />

              <label class="checkbox">
                <input
                  checked={isConfirmed3}
                  type="checkbox"
                  onChange={() => setIsConfirmed3(!isConfirmed3)}
                />
                <span style={{ color: "red", marginLeft: 5 }}>*</span>
                Confirm that you have prepared a complete text within the
                anonymous article file. Any identifying information has been
                included separately in a title page, acknowledgements or
                supplementary file not for review, to allow blinded review.
              </label>
            </div>
            <div className="block" />
          </div>
        );
      case 4:
        return (
          <ReviewAndSubmit
            form1Data={forms[0].data}
            addedKeywords={addedKeywords}
            authorsList={authorsList}
            filesSelected={filesSelected}
            fundersList={fundersList}
            coverLetter={coverLetter}
          />
        );
    }
  };

  return (
    <>
      {/* Loading Modal Wrapper */}
      <LoadingOverlay
        active={fileUploadLoading}
        spinner
        text="Upload files please wait a bit..."
      >
        <div
          style={{
            marginTop: 50,
            marginRight: "10%",
            marginLeft: "10%",
            padding: 35,
            border: "1px solid #ccc",
            borderRadius: 20,
            paddingBottom: submissionType == "" ? 200 : 20,
          }}
        >
          <div className="title">Submission</div>

          {/* Submission Category */}
          {submissionType == "" ? (
            <>
              <div className="subtitle">
                Please choose a category for your paper.
              </div>
              <div className="select">
                <select
                  value={submissionType}
                  onChange={(e) => {
                    if (e.target.value == "Select Submission Type") {
                      setSubmissionType("");
                    } else {
                      setSubmissionType(e.target.value);
                    }
                  }}
                  disabled={submissionType != "" ? true : false}
                >
                  <option>Select Submission Type</option>
                  <option>Case Study</option>
                  <option>Research Paper</option>
                  <option>Technical Paper</option>
                  <option>Select Submission Type</option>
                </select>
              </div>
            </>
          ) : (
            <>
              {/* Stepper*/}
              <div className="subtitle">{submissionType}</div>
              {/* <FileUploadTester /> */}
              {/* Errors Notification */}
              {forms[step - 1].errors != null && (
                <div class="notification is-danger is-light pl-6">
                  <div className="subtitle">Errors:</div>
                  <ul style={{ listStyleType: "disc" }}>
                    {forms[step - 1].errors.map((e) => (
                      <li>
                        <strong>{e}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
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
                  "Metadata",
                  decideStepperButtonColor(0),
                  decideStepperButtonIcon(0),
                  1
                )}
                {renderStepperButton(
                  "Upload Files",
                  decideStepperButtonColor(1),
                  decideStepperButtonIcon(1),
                  2
                )}
                {renderStepperButton(
                  "Details & Comments",
                  decideStepperButtonColor(2),
                  decideStepperButtonIcon(2),
                  3
                )}
                {renderStepperButton(
                  "Review Your Submission",
                  decideStepperButtonColor(3),
                  decideStepperButtonIcon(3),
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

              {renderFormBody(step)}
              <div className="block" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: 35,
                }}
              >
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure to leave? Entered data will be lost!`
                      )
                    ) {
                      navigate("/");
                    }
                  }}
                  className="button is-light"
                >
                  Cancel
                </button>
                <button
                  style={{ marginLeft: 5 }}
                  onClick={() => {
                    if (
                      window.confirm(`Are you sure to leave and save data?`)
                    ) {
                      navigate("/");
                    }
                  }}
                  className="button is-info is-light"
                >
                  Save Progress & Leave
                </button>
                <button
                  style={{ marginLeft: 5 }}
                  onClick={handleSubmission}
                  disabled={loading}
                  className="button is-info is-right"
                >
                  {step == 4 ? "Submit Paper" : "Next"}
                </button>
              </div>
            </>
          )}
        </div>
      </LoadingOverlay>
    </>
  );
}

export default MainForm;
