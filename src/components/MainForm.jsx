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

import { useAuth } from "../contexts/AuthContext";

function MainForm() {
  const [forms, setForms] = useState(
    new Array(4).fill({
      data: {},
      errors: null,
      isCompleted: true,
    })
  );

  const [step, setStep] = useState(2);

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

  const onInputChange = (e) => {
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

  async function handleSubmission(e) {
    e.preventDefault();

    setStep(step !== 4 && step + 1);
  }

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
            <label className="label">
              Keywords<span style={{ color: "red" }}>*</span>
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
                  <span style={{ marginLeft: 5 }}>Add</span>
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
            <label className="label">
              Authors<span style={{ color: "red" }}>*</span>
            </label>
            {/* Modals */}
            {toggleAuthorModal && (
              <div className="modal is-active is-clipped">
                <div className="modal-background"></div>
                <div className="modal-card">
                  <header className="modal-card-head">
                    <p className="modal-card-title">Modal title</p>
                    <button className="delete" aria-label="close"></button>
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
                              onChange={onInputChange}
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
                              onChange={onInputChange}
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
                              onChange={onInputChange}
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
                              onChange={onInputChange}
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
                {authorsList.map((a) => (
                  <tr>
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
                                <span className="file-label">Change file…</span>
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
                                `Are you sure to reomve file named ${filesSelected[i]}?`
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
                onClick={() => {
                  setFileUploadLoading(true);
                }}
              >
                <span className="icon is-small">
                  <FontAwesomeIcon color="white" icon={faUpload} />
                </span>
                <span>Upload Selected Files</span>
              </button>
            </div>
            <div className="block" />

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
        return <></>;
      case 4:
        return <></>;
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
            }}
          >
            <button
              onClick={handleSubmission}
              disabled={loading}
              className="button is-info is-right"
            >
              {step == 3 ? "Register" : "Next"}
            </button>
          </div>
        </div>
      </LoadingOverlay>
    </>
  );
}

export default MainForm;
